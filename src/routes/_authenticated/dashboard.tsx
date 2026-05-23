import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Cpu } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TinkerTrack" }] }),
  component: Dashboard,
});

function Dashboard() {
  const nav = useNavigate();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", "recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const active = projects.filter((p) => ["building", "testing"].includes(p.status));
  const activeTop = active[0];

  const { data: activeCounts } = useQuery({
    queryKey: ["projects", "counts", activeTop?.id],
    enabled: !!activeTop?.id,
    queryFn: async () => {
      const projectId = activeTop!.id as string;
      const [{ data: components, error: cErr }, { data: files, error: fErr }, { data: journal, error: jErr }] =
        await Promise.all([
          supabase.from("components").select("id").eq("project_id", projectId),
          supabase.from("project_files").select("id").eq("project_id", projectId),
          supabase.from("journal_entries").select("id").eq("project_id", projectId),
        ]);
      if (cErr) throw cErr;
      if (fErr) throw fErr;
      if (jErr) throw jErr;
      return { components: components?.length ?? 0, files: files?.length ?? 0, journal: journal?.length ?? 0 };
    },
  });

  const suggestions = (() => {
    if (!activeTop) return [];
    const s: string[] = [];
    if (!activeTop.wiring_notes || String(activeTop.wiring_notes).trim().length === 0) s.push("Add wiring notes so future-you can rebuild it");
    if ((activeCounts?.components ?? 0) === 0) s.push("List the key components and values");
    if ((activeCounts?.files ?? 0) === 0) s.push("Upload a photo or your latest sketch/code");
    if ((activeCounts?.journal ?? 0) === 0) s.push("Start a build journal entry (what changed today?)");
    s.push("Ask the assistant to sanity-check your wiring");
    return s.slice(0, 4);
  })();

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Workshop</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your latest builds, journals and ideas.</p>
        </div>
        <Button className="shadow-glow" type="button" onClick={() => nav({ to: "/projects/new" })}><Plus className="mr-1.5 h-4 w-4" /> New project</Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total projects" value={projects.length} icon={Cpu} />
        <Stat label="Currently building" value={active.length} icon={Cpu} accent />
        <Stat label="Templates" value={TEMPLATES.length} icon={BookOpen} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Suggestions</h2>
          {activeTop ? (
            <Link to="/projects/$projectId" params={{ projectId: activeTop.id }} className="text-sm font-medium text-primary hover:underline">
              Open active project →
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">No active projects</span>
          )}
        </div>
        <div className="rounded-xl border border-border bg-gradient-card p-5">
          {suggestions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Create a project or mark one as building/testing to get suggestions.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {suggestions.map((s) => (
                <li key={s}>
                  {activeTop ? (
                    <Link to="/projects/$projectId" params={{ projectId: activeTop.id }} className="text-primary hover:underline">
                      {s}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">{s}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent projects</h2>
          <Link to="/projects" className="text-sm font-medium text-primary hover:underline">View all →</Link>
        </div>
        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">Loading…</div>
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Start from a template</h2>
          <Link to="/templates" className="text-sm font-medium text-primary hover:underline">All templates →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.slice(0, 3).map((t) => (
            <Link key={t.slug} to="/templates" className="group rounded-xl border border-border bg-gradient-card p-4 transition hover:shadow-elev">
              <p className="text-xs font-medium uppercase tracking-wider text-primary">{t.difficulty}</p>
              <h3 className="mt-1 font-semibold text-foreground">{t.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon: Icon, accent }: { label: string; value: number; icon: any; accent?: boolean }) {
  return (
    <div className={`rounded-xl border border-border p-5 ${accent ? "bg-gradient-hero text-primary-foreground" : "bg-gradient-card"}`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-medium uppercase tracking-wider ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{label}</p>
        <Icon className={`h-4 w-4 ${accent ? "text-primary-foreground/80" : "text-primary"}`} />
      </div>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <Cpu className="mx-auto h-10 w-10 text-primary/40" />
      <h3 className="mt-3 font-semibold text-foreground">No projects yet</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Create your first project or start from a template.</p>
      <div className="mt-5 flex justify-center gap-2">
        <Button asChild><Link to="/projects/new"><Plus className="mr-1.5 h-4 w-4" /> New project</Link></Button>
        <Button asChild variant="outline"><Link to="/templates">Browse templates</Link></Button>
      </div>
    </div>
  );
}