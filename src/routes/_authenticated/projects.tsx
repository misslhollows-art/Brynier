import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const STATUSES = ["all", "idea", "building", "testing", "completed", "failed"] as const;

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({ meta: [{ title: "Projects — Brynier" }] }),
  component: ProjectsRoute,
});

function ProjectsRoute() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/projects") return <Outlet />;
  return <ProjectsIndex />;
}

function ProjectsIndex() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", "list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: components = [] } = useQuery({
    queryKey: ["components", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("components").select("project_id,name");
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    const componentMatchProjectIds = new Set(
      components
        .filter((c) => (c.name ?? "").toLowerCase().includes(q.toLowerCase()))
        .map((c) => c.project_id),
    );

    return projects.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      const hay = `${p.title} ${p.description ?? ""} ${(p.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q.toLowerCase()) || componentMatchProjectIds.has(p.id);
    });
  }, [projects, components, q, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">{projects.length} total</p>
        </div>
        <Button className="shadow-glow" type="button" onClick={() => nav({ to: "/projects/new" })}>
          <Plus className="mr-1.5 h-4 w-4" /> New project
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, tags, components…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                status === s ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/70"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          No projects match your filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}