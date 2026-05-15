import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/projects/new")({
  head: () => ({ meta: [{ title: "New project — TinkerTrack" }] }),
  component: NewProject,
});

function NewProject() {
  type DraftComponent = { name: string; quantity: number; voltage?: string; notes?: string; purchase_link?: string };

  const nav = useNavigate();
  const search = (Route.useSearch() as { template?: string }) ?? {};
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [estimated_cost, setCost] = useState("0");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [draftComponents, setDraftComponents] = useState<DraftComponent[]>([]);
  const [compName, setCompName] = useState("");
  const [compQty, setCompQty] = useState("1");
  const [compVoltage, setCompVoltage] = useState("");
  const [compNotes, setCompNotes] = useState("");
  const [compLink, setCompLink] = useState("");

  const [pickedFiles, setPickedFiles] = useState<File[]>([]);

  // Pre-fill from template
  useState(() => {
    if (!search.template) return;
    import("@/lib/templates").then(({ findTemplate }) => {
      const t = findTemplate(search.template!);
      if (!t) return;
      setTitle(t.title);
      setDescription(t.description);
      setTags(t.tags.join(", "));
      setDifficulty(t.difficulty);
      setCost(String(t.estimated_cost));
      if (t.components?.length) {
        setDraftComponents(
          t.components.map((c) => ({
            name: c.name,
            quantity: c.quantity,
            voltage: c.voltage ?? "",
            notes: c.notes ?? "",
          })),
        );
      }
    });
  });

  const addDraftComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;
    setDraftComponents((prev) => [
      ...prev,
      {
        name: compName.trim(),
        quantity: Number(compQty) || 1,
        voltage: compVoltage.trim(),
        notes: compNotes.trim(),
        purchase_link: compLink.trim(),
      },
    ]);
    setCompName("");
    setCompQty("1");
    setCompVoltage("");
    setCompNotes("");
    setCompLink("");
  };

  const removeDraftComponent = (idx: number) => {
    setDraftComponents((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setLoading(false); return; }

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        user_id: userData.user.id,
        title,
        description,
        tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
        difficulty,
        estimated_cost: Number(estimated_cost) || 0,
        status: "idea",
      })
      .select()
      .single();

    if (error || !project) { setLoading(false); return toast.error(error?.message ?? "Failed"); }

    // If template, seed wiring notes (components handled below via the draft list)
    if (search.template) {
      const { findTemplate } = await import("@/lib/templates");
      const t = findTemplate(search.template);
      if (t?.wiring_notes) {
        await supabase.from("projects").update({ wiring_notes: t.wiring_notes }).eq("id", project.id);
      }
    }

    if (draftComponents.length) {
      const { error: compErr } = await supabase.from("components").insert(
        draftComponents.map((c) => ({
          project_id: project.id,
          user_id: userData.user!.id,
          name: c.name,
          quantity: c.quantity,
          voltage: c.voltage ?? "",
          notes: c.notes ?? "",
          purchase_link: c.purchase_link ?? "",
        })),
      );
      if (compErr) toast.error(compErr.message);
    }

    if (pickedFiles.length) {
      for (const file of pickedFiles) {
        const safeName = file.name.replace(/[^\w.\- ()[\]]+/g, "_");
        const path = `${userData.user.id}/${project.id}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("project-media").upload(path, file);
        if (upErr) { toast.error(upErr.message); continue; }
        const isCode = /\.(ino|py|c|cpp|h|js|ts|txt|hex|bin|json|yaml|yml|md)$/i.test(file.name);
        const { error: dbErr } = await supabase.from("project_files").insert({
          project_id: project.id,
          user_id: userData.user.id,
          storage_path: path,
          file_name: file.name,
          file_type: isCode ? "code" : "media",
          mime_type: file.type,
          size_bytes: file.size,
        });
        if (dbErr) toast.error(dbErr.message);
      }
    }

    toast.success("Project created");
    nav({ to: "/projects/$projectId", params: { projectId: project.id } });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">New project</h1>
      <p className="mt-1 text-sm text-muted-foreground">Step {step} of 4</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-xl border border-border bg-gradient-card p-6">
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Name</Label>
              <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ESP32 dog feeder" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does it do? What's the goal?" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="esp32, servo" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="diff">Difficulty</Label>
                <select id="diff" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cost">Est. cost ($)</Label>
                <Input id="cost" type="number" min="0" step="0.5" value={estimated_cost} onChange={(e) => setCost(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Components</Label>
              <p className="mt-1 text-xs text-muted-foreground">Add the key parts and values now, or skip and do it later.</p>
            </div>

            <div className="grid gap-2 sm:grid-cols-[2fr_80px_120px_2fr_2fr_auto]">
              <Input placeholder="Component name (e.g. ESP32)" value={compName} onChange={(e) => setCompName(e.target.value)} />
              <Input type="number" min="1" placeholder="Qty" value={compQty} onChange={(e) => setCompQty(e.target.value)} />
              <Input placeholder="Voltage" value={compVoltage} onChange={(e) => setCompVoltage(e.target.value)} />
              <Input placeholder="Notes" value={compNotes} onChange={(e) => setCompNotes(e.target.value)} />
              <Input placeholder="Purchase link" value={compLink} onChange={(e) => setCompLink(e.target.value)} />
              <Button type="button" onClick={(e) => addDraftComponent(e as any)} disabled={!compName.trim()}>
                Add
              </Button>
            </div>

            {draftComponents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">No components yet.</div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Qty</th>
                      <th className="px-3 py-2 text-left">Voltage</th>
                      <th className="px-3 py-2 text-left">Notes</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftComponents.map((c, idx) => (
                      <tr key={`${c.name}-${idx}`} className="border-t border-border">
                        <td className="px-3 py-2 font-medium text-foreground">{c.name}</td>
                        <td className="px-3 py-2">{c.quantity}</td>
                        <td className="px-3 py-2 text-muted-foreground">{c.voltage || "—"}</td>
                        <td className="px-3 py-2 text-muted-foreground">{c.notes || "—"}</td>
                        <td className="px-3 py-2 text-right">
                          <button type="button" onClick={() => removeDraftComponent(idx)} className="text-muted-foreground hover:text-destructive">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Upload photos/code (optional)</Label>
              <Input type="file" multiple onChange={(e) => setPickedFiles(Array.from(e.target.files ?? []))} />
              {pickedFiles.length > 0 && (
                <p className="text-xs text-muted-foreground">{pickedFiles.length} file(s) selected</p>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={() => nav({ to: "/projects" })}>Cancel</Button>
          {step > 1 && (
            <Button type="button" variant="outline" disabled={loading} onClick={() => setStep((step - 1) as any)}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" disabled={loading || (step === 1 && !title.trim())} onClick={() => setStep((step + 1) as any)}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={loading || !title.trim()}>{loading ? "Creating…" : "Create project"}</Button>
          )}
        </div>
      </form>
    </div>
  );
}
