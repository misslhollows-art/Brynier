import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import { ArrowLeft, Bot, Boxes, FileCode2, Image as ImageIcon, Notebook, Plus, Trash2, Upload, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/projects/$projectId")({
  head: () => ({ meta: [{ title: "Project — Brynier" }] }),
  component: ProjectPage,
});

const TABS = ["overview", "components", "wiring", "files", "journal", "ai"] as const;
type Tab = (typeof TABS)[number];

function ProjectPage() {
  const { projectId } = Route.useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!project) return <p>Project not found.</p>;

  const updateField = async (patch: Record<string, any>) => {
    const { error } = await supabase.from("projects").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", projectId);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["project", projectId] });
  };

  const onDelete = async () => {
    if (!confirm("Delete this project and all its data?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", projectId);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    nav({ to: "/projects" });
  };

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <input
            value={project.title}
            onChange={(e) => qc.setQueryData(["project", projectId], { ...project, title: e.target.value })}
            onBlur={(e) => updateField({ title: e.target.value })}
            className="bg-transparent text-3xl font-semibold tracking-tight text-foreground outline-none focus:bg-accent/40 focus:px-1 focus:rounded"
          />
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={project.status} />
            <select
              value={project.status}
              onChange={(e) => updateField({ status: e.target.value })}
              className="h-7 rounded-md border border-input bg-background px-2 text-xs"
            >
              {["idea","building","testing","completed","failed"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="text-xs text-muted-foreground capitalize">· {project.difficulty}</span>
            {(project.estimated_cost ?? 0) > 0 && <span className="text-xs text-muted-foreground">· ~${project.estimated_cost}</span>}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="mr-1.5 h-4 w-4" /> Delete
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-3 py-2 text-sm font-medium capitalize transition ${
              tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              {t === "overview" && <Boxes className="h-3.5 w-3.5" />}
              {t === "components" && <Boxes className="h-3.5 w-3.5" />}
              {t === "wiring" && <Zap className="h-3.5 w-3.5" />}
              {t === "files" && <FileCode2 className="h-3.5 w-3.5" />}
              {t === "journal" && <Notebook className="h-3.5 w-3.5" />}
              {t === "ai" && <Bot className="h-3.5 w-3.5" />}
              {t === "ai" ? "AI Assistant" : t}
            </span>
            {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      <div>
        {tab === "overview" && <Overview project={project} updateField={updateField} />}
        {tab === "components" && <Components projectId={projectId} />}
        {tab === "wiring" && <Wiring project={project} updateField={updateField} />}
        {tab === "files" && <Files projectId={projectId} />}
        {tab === "journal" && <Journal projectId={projectId} />}
        {tab === "ai" && <AskAI project={project} projectId={projectId} />}
      </div>
    </div>
  );
}

function Overview({ project, updateField }: { project: any; updateField: (p: any) => void }) {
  const [desc, setDesc] = useState(project.description ?? "");
  const [tags, setTags] = useState((project.tags ?? []).join(", "));
  const [cost, setCost] = useState(String(project.estimated_cost ?? 0));
  return (
    <div className="space-y-5 rounded-xl border border-border bg-gradient-card p-6">
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} onBlur={() => updateField({ description: desc })} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Tags (comma-separated)</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} onBlur={() => updateField({ tags: tags.split(",").map((s: string) => s.trim()).filter(Boolean) })} />
        </div>
        <div className="space-y-1.5">
          <Label>Difficulty</Label>
          <select value={project.difficulty} onChange={(e) => updateField({ difficulty: e.target.value })} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Est. cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            onBlur={() => updateField({ estimated_cost: Number(cost) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}

function Components({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["components", projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from("components").select("*").eq("project_id", projectId).order("created_at");
      if (error) throw error; return data;
    },
  });
  const [name, setName] = useState(""); const [qty, setQty] = useState("1");
  const [voltage, setVoltage] = useState(""); const [notes, setNotes] = useState(""); const [link, setLink] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<{ name: string; quantity: string; voltage: string; notes: string; purchase_link: string }>({
    name: "",
    quantity: "1",
    voltage: "",
    notes: "",
    purchase_link: "",
  });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser(); if (!u.user) return;
    const { error } = await supabase.from("components").insert({
      project_id: projectId, user_id: u.user.id, name, quantity: Number(qty) || 1, voltage, notes, purchase_link: link,
    });
    if (error) return toast.error(error.message);
    setName(""); setQty("1"); setVoltage(""); setNotes(""); setLink("");
    qc.invalidateQueries({ queryKey: ["components", projectId] });
  };

  const remove = async (id: string) => {
    await supabase.from("components").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["components", projectId] });
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setEdit({
      name: c.name ?? "",
      quantity: String(c.quantity ?? 1),
      voltage: c.voltage ?? "",
      notes: c.notes ?? "",
      purchase_link: c.purchase_link ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("components").update({
      name: edit.name,
      quantity: Number(edit.quantity) || 1,
      voltage: edit.voltage,
      notes: edit.notes,
      purchase_link: edit.purchase_link,
    }).eq("id", editingId);
    if (error) return toast.error(error.message);
    setEditingId(null);
    qc.invalidateQueries({ queryKey: ["components", projectId] });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="grid gap-2 rounded-xl border border-border bg-gradient-card p-4 sm:grid-cols-[2fr_80px_100px_2fr_2fr_auto]">
        <Input placeholder="Component name (e.g. ESP32)" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="number" min="1" placeholder="Qty" value={qty} onChange={(e) => setQty(e.target.value)} />
        <Input placeholder="Voltage" value={voltage} onChange={(e) => setVoltage(e.target.value)} />
        <Input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Input placeholder="Purchase link" value={link} onChange={(e) => setLink(e.target.value)} />
        <Button type="submit"><Plus className="h-4 w-4" /></Button>
      </form>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">No components yet.</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Qty</th>
                <th className="px-3 py-2 text-left">Voltage</th>
                <th className="px-3 py-2 text-left">Notes</th>
                <th className="px-3 py-2 text-left">Link</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium text-foreground">
                    {editingId === c.id ? (
                      <Input value={edit.name} onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))} />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === c.id ? (
                      <Input type="number" min="1" value={edit.quantity} onChange={(e) => setEdit((p) => ({ ...p, quantity: e.target.value }))} />
                    ) : (
                      c.quantity
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {editingId === c.id ? (
                      <Input value={edit.voltage} onChange={(e) => setEdit((p) => ({ ...p, voltage: e.target.value }))} />
                    ) : (
                      c.voltage || "—"
                    )}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {editingId === c.id ? (
                      <Input value={edit.notes} onChange={(e) => setEdit((p) => ({ ...p, notes: e.target.value }))} />
                    ) : (
                      c.notes || "—"
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {editingId === c.id ? (
                      <Input value={edit.purchase_link} onChange={(e) => setEdit((p) => ({ ...p, purchase_link: e.target.value }))} />
                    ) : c.purchase_link ? (
                      <a href={c.purchase_link} target="_blank" rel="noreferrer" className="text-primary hover:underline">link</a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {editingId === c.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">Cancel</button>
                        <button onClick={saveEdit} className="text-primary hover:underline">Save</button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(c)} className="text-muted-foreground hover:text-foreground">Edit</button>
                        <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Wiring({ project, updateField }: { project: any; updateField: (p: any) => void }) {
  const [val, setVal] = useState(project.wiring_notes ?? "");
  return (
    <div className="space-y-3 rounded-xl border border-border bg-gradient-card p-6">
      <Label>Wiring notes</Label>
      <Textarea
        rows={14}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => updateField({ wiring_notes: val })}
        placeholder={"GPIO 12 -> Relay IN\nGPIO 5 -> PIR Sensor\nGround shared"}
        className="font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">Saved on blur. Plain text — markdown OK.</p>
    </div>
  );
}

function Files({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"all" | "media" | "code">("all");

  const { data: files = [] } = useQuery({
    queryKey: ["files", projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from("project_files").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;

    setUploading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("You must be signed in to upload.");

      const maxBytes = 50 * 1024 * 1024; // 50MB per file is plenty for a personal maker log
      let uploadedCount = 0;

      for (const file of picked) {
        if (file.size > maxBytes) {
          toast.error(`"${file.name}" is too large (max 50MB).`);
          continue;
        }

        const safeName = file.name.replace(/[^\w.\- ()[\]]+/g, "_");
        const path = `${u.user.id}/${projectId}/${Date.now()}-${safeName}`;
        const { error: upErr } = await supabase.storage.from("project-media").upload(path, file);
        if (upErr) {
          toast.error(upErr.message);
          continue;
        }

        const isCode = /\.(ino|py|c|cpp|h|js|ts|txt|hex|bin|json|yaml|yml|md)$/i.test(file.name);
        const { error: dbErr } = await supabase.from("project_files").insert({
          project_id: projectId,
          user_id: u.user.id,
          storage_path: path,
          file_name: file.name,
          file_type: isCode ? "code" : "media",
          mime_type: file.type,
          size_bytes: file.size,
        });
        if (dbErr) {
          toast.error(dbErr.message);
          continue;
        }

        uploadedCount += 1;
      }

      if (uploadedCount > 0) {
        qc.invalidateQueries({ queryKey: ["files", projectId] });
        toast.success(uploadedCount === 1 ? "Uploaded" : `Uploaded ${uploadedCount} files`);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async (id: string, path: string) => {
    await supabase.storage.from("project-media").remove([path]);
    await supabase.from("project_files").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["files", projectId] });
  };

  const shown = files.filter((f) => (filter === "all" ? true : f.file_type === filter));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Photos, videos, screenshots, Arduino sketches, Python scripts.</p>
        <Button asChild size="sm" disabled={uploading}>
          <label className="cursor-pointer">
            <Upload className="mr-1.5 h-4 w-4" /> {uploading ? "Uploading…" : "Upload file"}
            <input ref={inputRef} type="file" multiple className="hidden" onChange={onUpload} />
          </label>
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "media", "code"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/70"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">No files yet.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((f) => <FileCard key={f.id} file={f} onDelete={() => remove(f.id, f.storage_path)} />)}
        </div>
      )}
    </div>
  );
}

function FileCard({ file, onDelete }: { file: any; onDelete: () => void }) {
  const [url, setUrl] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [codeText, setCodeText] = useState<string>("");
  const [codeLoading, setCodeLoading] = useState(false);
  useEffect(() => {
    supabase.storage.from("project-media").createSignedUrl(file.storage_path, 3600).then(({ data }) => {
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  }, [file.storage_path]);
  const isImage = file.mime_type?.startsWith("image/");
  const isCode = file.file_type === "code";

  const openPreview = async () => {
    setOpen(true);
    if (!isCode) return;
    if (codeText) return;
    setCodeLoading(true);
    try {
      const { data: blob, error } = await supabase.storage.from("project-media").download(file.storage_path);
      if (error || !blob) throw error ?? new Error("Download failed");
      const text = await (blob as any).text?.();
      setCodeText(typeof text === "string" ? text : "");
    } catch {
      setCodeText("");
    } finally {
      setCodeLoading(false);
    }
  };
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-gradient-card">
      <div className="aspect-[16/10] bg-muted">
        {isImage && url ? (
          <img src={url} alt={file.file_name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            {file.file_type === "code" ? <FileCode2 className="h-8 w-8 text-primary/40" /> : <ImageIcon className="h-8 w-8 text-primary/40" />}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <button onClick={openPreview} className="line-clamp-1 text-left text-sm font-medium text-foreground hover:text-primary">{file.file_name}</button>
        <div className="flex items-center gap-2">
          {url ? (
            <a href={url} target="_blank" rel="noreferrer" className="text-xs font-medium text-muted-foreground hover:text-foreground">Open</a>
          ) : null}
          <button onClick={onDelete} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="line-clamp-1">{file.file_name}</DialogTitle>
          </DialogHeader>
          {isCode ? (
            <div className="max-h-[70vh] overflow-auto rounded-md border border-border bg-background p-3 font-mono text-xs">
              {codeLoading ? "Loading..." : (codeText || "No preview available.")}
            </div>
          ) : url ? (
            <div className="max-h-[70vh] overflow-auto">
              {isImage ? <img src={url} alt={file.file_name} className="h-auto w-full rounded-md" /> : <a href={url} target="_blank" rel="noreferrer" className="text-primary hover:underline">Open file</a>}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Preview unavailable.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Journal({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const [entry, setEntry] = useState("");
  const { data: entries = [] } = useQuery({
    queryKey: ["journal", projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from("journal_entries").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
      if (error) throw error; return data;
    },
  });
  const add = async (e: React.FormEvent) => {
    e.preventDefault(); if (!entry.trim()) return;
    const { data: u } = await supabase.auth.getUser(); if (!u.user) return;
    await supabase.from("journal_entries").insert({ project_id: projectId, user_id: u.user.id, entry });
    setEntry(""); qc.invalidateQueries({ queryKey: ["journal", projectId] });
  };
  const remove = async (id: string) => { await supabase.from("journal_entries").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["journal", projectId] }); };

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="space-y-2 rounded-xl border border-border bg-gradient-card p-4">
        <Textarea rows={3} value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="What just happened? (Motor overheating, changed resistor, working now…)" />
        <div className="flex justify-end"><Button type="submit" size="sm" disabled={!entry.trim()}><Plus className="mr-1 h-4 w-4" /> Add entry</Button></div>
      </form>
      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">No journal entries yet.</div>
      ) : (
        <ol className="relative space-y-3 border-l-2 border-border pl-5">
          {entries.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[27px] top-2 h-3 w-3 rounded-full border-2 border-primary bg-background" />
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="whitespace-pre-wrap text-sm text-foreground">{e.entry}</p>
                  <button onClick={() => remove(e.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function AskAI({ project, projectId }: { project: any; projectId: string }) {
  const [loading, setLoading] = useState(false);

  const { data: components = [] } = useQuery({
    queryKey: ["ai", "ctx", projectId, "components"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("components")
        .select("name,quantity,voltage,notes")
        .eq("project_id", projectId);
      if (error) throw error;
      return data;
    },
  });

  const { data: journal = [] } = useQuery({
    queryKey: ["ai", "ctx", projectId, "journal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("entry,created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const buildPrompt = () => {
    const header = `PROJECT: ${project.title}\nSTATUS: ${project.status} | DIFFICULTY: ${project.difficulty}\nDESCRIPTION: ${project.description || "(none)"}\nTAGS: ${(project.tags || []).join(", ") || "(none)"}`;

    const comps = (components || []).length
      ? (components || [])
          .map((c: any) => `- ${c.quantity ?? 1}x ${c.name}${c.voltage ? ` (${c.voltage})` : ""}${c.notes ? ` - ${c.notes}` : ""}`)
          .join("\n")
      : "(none)";

    const wiring = project.wiring_notes || "(none)";

    const recent = (journal || []).length
      ? (journal || []).map((j: any) => `- ${j.entry}`).join("\n")
      : "(none)";

    return [
      "You are an electronics co-pilot. Be concise, practical, and safety-aware.",
      "",
      header,
      "",
      "COMPONENTS:\n" + comps,
      "",
      "WIRING NOTES:\n" + wiring,
      "",
      "RECENT JOURNAL:\n" + recent,
      "",
      "QUESTION:",
    ].join("\n");
  };

  const onCopy = async () => {
    setLoading(true);
    try {
      const text = buildPrompt();
      await navigator.clipboard.writeText(text);
      toast.success("Copied build context. Paste it into your AI tool.");
    } catch (err: any) {
      toast.error(err?.message ?? "Copy failed");
    } finally {
      setLoading(false);
    }
  };

  const onOpen = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    toast.message("Paste the copied context into the chat.");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-gradient-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Ask AI (external)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The in-app AI assistant is disabled for now. Copy your build context and ask an external AI.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={onCopy} disabled={loading}>
            Copy build context
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpen("https://chatgpt.com/")} disabled={loading}>
            Open ChatGPT
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpen("https://gemini.google.com/app")} disabled={loading}>
            Open Gemini
          </Button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Tip: click "Copy build context", open your AI tool, paste, then add your question.
        </p>
      </div>
    </div>
  );
}
