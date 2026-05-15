import { Link } from "@tanstack/react-router";
import { StatusBadge } from "./StatusBadge";
import { Cpu } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  difficulty: string | null;
  tags: string[] | null;
  cover_image_url: string | null;
  updated_at: string;
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-gradient-card transition hover:shadow-elev"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {project.cover_image_url ? (
          <img src={project.cover_image_url} alt={project.title} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="grid-bg flex h-full w-full items-center justify-center bg-gradient-hero/5">
            <Cpu className="h-10 w-10 text-primary/40" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <StatusBadge status={project.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-foreground">{project.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.description || "No description yet."}</p>
        {project.tags && project.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {project.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
