import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TEMPLATES } from "@/lib/templates";
import { listVisibleTemplates, templateRowToTemplate, type TemplateLike } from "@/lib/templates.db";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/templates")({
  head: () => ({ meta: [{ title: "Templates — TinkerTrack" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const [dbTemplates, setDbTemplates] = useState<TemplateLike[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listVisibleTemplates()
      .then((rows) => rows.map(templateRowToTemplate))
      .then((items) => {
        if (cancelled) return;
        setDbTemplates(items);
      })
      .catch(() => {
        // Fall back to bundled templates silently
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const templates = useMemo(() => {
    const merged = new Map<string, TemplateLike>();
    for (const t of TEMPLATES) merged.set(t.slug, t);
    for (const t of dbTemplates ?? []) merged.set(t.slug, t);
    return Array.from(merged.values());
  }, [dbTemplates]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start from a known-good circuit. Components and wiring notes are pre-filled.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.slug} className="flex flex-col rounded-xl border border-border bg-gradient-card p-5 shadow-sm transition hover:shadow-elev">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">{t.difficulty}</span>
            </div>
            <h3 className="mt-3 font-semibold text-foreground">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-medium uppercase text-accent-foreground">{tag}</span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Free · {t.components.length} components</p>
            <Button asChild size="sm" className="mt-4 self-start">
              <Link to="/projects/new" search={{ template: t.slug } as any}>
                Use template <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
