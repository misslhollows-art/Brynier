import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { exportMyData } from "@/lib/export.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { buildBackupZip, type OfflineBackupManifest } from "@/lib/offline-backup";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/backup")({
  head: () => ({ meta: [{ title: "Backup - TinkerTrack" }] }),
  component: BackupPage,
});

function BackupPage() {
  const exportFn = useServerFn(exportMyData);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const onDownload = async () => {
    setLoading(true);
    try {
      const data = await exportFn({ data: {} as any });

      const manifest: OfflineBackupManifest = {
        version: 1,
        exported_at: data.exported_at,
        data,
        files: (data.project_files ?? []).map((f: any) => ({
          path: f.storage_path,
          name: f.file_name,
          mime: f.mime_type ?? undefined,
          size: f.size_bytes ?? undefined,
        })),
      };

      const fileBytesByPath: Record<string, Uint8Array> = {};
      for (const f of manifest.files) {
        try {
          const { data: blob, error } = await supabase.storage.from("project-media").download(f.path);
          if (error || !blob) continue;
          const ab = await (blob as any).arrayBuffer?.();
          if (!ab) continue;
          fileBytesByPath[f.path] = new Uint8Array(ab);
        } catch {
          // skip file; backup still includes the metadata
        }
      }

      const zipBytes = buildBackupZip({ manifest, fileBytesByPath });
      const zipU8 = new Uint8Array(zipBytes);
      const blob = new Blob([zipU8], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = `tinkertrack-backup-${stamp}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded");
    } catch (err: any) {
      toast.error(err?.message ?? "Backup failed");
    } finally {
      setLoading(false);
    }
  };

  const onRestore = async (file: File) => {
    setRestoring(true);
    try {
      const { parseBackupZip } = await import("@/lib/offline-backup");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { manifest, fileBytesByPath } = parseBackupZip(bytes);

      if (!confirm("Restore will replace your current data. Continue?")) return;

      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("You must be signed in.");

      // Delete existing rows for this user (best-effort, in dependency-safe order)
      await supabase.from("ai_messages").delete().eq("user_id", u.user.id);
      await supabase.from("journal_entries").delete().eq("user_id", u.user.id);
      await supabase.from("components").delete().eq("user_id", u.user.id);
      await supabase.from("project_files").delete().eq("user_id", u.user.id);
      await supabase.from("projects").delete().eq("user_id", u.user.id);

      // Restore core rows
      const payload = manifest.data ?? {};
      if (payload.projects?.length) {
        const { error } = await supabase.from("projects").insert(payload.projects);
        if (error) throw error;
      }
      if (payload.components?.length) {
        const { error } = await supabase.from("components").insert(payload.components);
        if (error) throw error;
      }
      if (payload.journal_entries?.length) {
        const { error } = await supabase.from("journal_entries").insert(payload.journal_entries);
        if (error) throw error;
      }
      if (payload.ai_messages?.length) {
        const { error } = await supabase.from("ai_messages").insert(payload.ai_messages);
        if (error) throw error;
      }

      // Restore files: upload bytes, then insert metadata rows.
      // Note: storage paths include the original userId; enforce current user namespace by rewriting.
      const fileRows = payload.project_files ?? [];
      for (const row of fileRows) {
        const origPath = row.storage_path as string;
        const origBytes = fileBytesByPath[origPath];
        if (!origPath || !origBytes) continue;

        const parts = origPath.split("/");
        parts[0] = u.user.id; // force current user folder
        const newPath = parts.join("/");

        const { error: upErr } = await supabase.storage.from("project-media").upload(newPath, origBytes, { upsert: true });
        if (upErr) throw upErr;

        row.storage_path = newPath;
        row.user_id = u.user.id;
      }
      if (fileRows.length) {
        const { error } = await supabase.from("project_files").insert(fileRows);
        if (error) throw error;
      }

      // Restore profile last (don’t overwrite email; only profile table fields)
      if (payload.profile) {
        payload.profile.id = u.user.id;
        const { error } = await supabase.from("profiles").upsert(payload.profile);
        if (error) throw error;
      }

      toast.success("Restore complete");
    } catch (err: any) {
      toast.error(err?.message ?? "Restore failed");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Backup</h1>
        <p className="mt-1 text-sm text-muted-foreground">Download or restore an offline ZIP (data + uploaded files).</p>
      </div>

      <div className="rounded-xl border border-border bg-gradient-card p-6">
        <Button onClick={onDownload} disabled={loading}>
          {loading ? "Preparing..." : "Download backup ZIP"}
        </Button>
        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium text-foreground">Restore from ZIP</label>
          <input
            type="file"
            accept=".zip"
            disabled={restoring || loading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onRestore(f);
              e.currentTarget.value = "";
            }}
          />
          <p className="text-xs text-muted-foreground">Restore replaces your current data. Keep a backup copy elsewhere too.</p>
        </div>
      </div>
    </div>
  );
}
