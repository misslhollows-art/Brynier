import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Bot, Boxes, FileCode2, Notebook, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TinkerTrack — Document, debug & ship your DIY electronics projects" },
      { name: "description", content: "Project companion for makers. Track components, wiring, code, journal, and an AI assistant trained on your project." },
    ],
  }),
  component: Landing,
});

function Feature({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="group relative rounded-xl border border-border bg-gradient-card p-5 transition hover:shadow-elev">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="absolute inset-x-0 top-0 -z-0 h-72 bg-gradient-hero opacity-[0.06]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> AI co-pilot for hardware builds
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Stop losing your <span className="bg-gradient-hero bg-clip-text text-transparent">wiring notes</span>.
              <br className="hidden sm:block" /> Start shipping your projects.
            </h1>
            <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
              TinkerTrack is a project companion for DIY electronics makers. Document components, wiring,
              code and journal entries — then troubleshoot with an AI that understands your build.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/signup">
                  Start a project free <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card. Free tier includes unlimited journals and the AI assistant.
            </p>
          </div>

          {/* Mock dashboard card */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-elev">
              <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-xs text-muted-foreground">tinkertrack.app/projects/dog-feeder</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Components</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">12</p>
                  <p className="mt-1 text-xs text-muted-foreground">ESP32 · SG90 · 5V relay…</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Journal</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">28</p>
                  <p className="mt-1 text-xs text-muted-foreground">Last: "Servo jitter fixed with cap"</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AI assists</p>
                  <p className="mt-2 text-2xl font-semibold text-primary">∞</p>
                  <p className="mt-1 text-xs text-muted-foreground">Trained on your build</p>
                </div>
              </div>
              <div className="border-t border-border bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-foreground">
                    Your servo is jittering because the ESP32's 3.3V regulator can't supply the inrush current.
                    Power the SG90 from a separate <span className="font-mono text-primary">5V</span> rail, share GND,
                    and add a <span className="font-mono text-primary">100µF</span> cap across V+/GND.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Everything in one place</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for the way makers actually work
          </h2>
          <p className="mt-3 text-muted-foreground">
            No more WhatsApp photos, scattered notes, or rebuilding the same circuit twice.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={Boxes} title="Components" body="Track every part — quantity, voltage, notes, purchase link. Search across all projects." />
          <Feature icon={Zap} title="Wiring notes" body="Plain-text wiring like GPIO 12 → Relay IN. Versioned alongside the project." />
          <Feature icon={FileCode2} title="Code & files" body="Drop in Arduino sketches, Python scripts, firmware. Photos and screenshots too." />
          <Feature icon={Notebook} title="Build journal" body="Timeline of what worked and what didn't. Future-you will thank present-you." />
          <Feature icon={Bot} title="AI assistant" body="Asks knows your project. Resistor values, wiring sanity, debugging — instant answers." />
          <Feature icon={BookOpen} title="Templates" body="Smart doorbell, dog feeder, plant watering, motion sensor — start from a known-good circuit." />
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border bg-gradient-hero">
        <div className="grid-bg absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
            Your next build deserves a real workshop notebook.
          </h2>
          <p className="mt-3 text-primary-foreground/80">Free forever for your first projects. No setup.</p>
          <div className="mt-7">
            <Button asChild size="lg" variant="secondary" className="shadow-elev">
              <Link to="/signup">Create your account →</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-xs text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} TinkerTrack</span>
          <span>Made for makers · Powered by Lovable Cloud</span>
        </div>
      </footer>
    </div>
  );
}
