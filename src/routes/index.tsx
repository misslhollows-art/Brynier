import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Bot, Boxes, FileCode2, Gift, Notebook, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brynier — Document, debug & ship your DIY electronics projects" },
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

const GIFT_STORAGE_KEY = "brynier_gift_unboxed_2026_05_25";

function getSADateParts(now = new Date()) {
  // Use a fixed, explicit timezone so behavior is correct even if the viewer is outside SA.
  const dtf = new Intl.DateTimeFormat("en-ZA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(now);
  const map = Object.fromEntries(parts.filter((p) => p.type !== "literal").map((p) => [p.type, p.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
  };
}

function isBirthdayWindow(now = new Date()) {
  const { year, month, day, hour } = getSADateParts(now);
  if (year !== 2026 || month !== 5 || day !== 25) return false;
  return hour >= 0 && hour < 12;
}

function BirthdayGate({ onUnbox }: { onUnbox: () => void }) {
  const message =
    "Paternal/Pa,\n\n" +
    "Happy birthday\n\n" +
    "This is for all those times you stack a jar and a metal bowl in the shops and say, \"Nix, don't you think this would make a nice lamp, huh?\".\n\n" +
    "Sha and I have worked tirelessly to bring you Brynier, so that you can keep track of all your jar lamp projects.\n\n" +
    "Lots of love Nix and Sha";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-96 bg-gradient-hero opacity-[0.10]" />

        {/* Streamers */}
        <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 -translate-x-10 -translate-y-10 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 translate-x-10 -translate-y-10 rounded-full bg-fuchsia-500/15 blur-3xl" />

        {/* Balloons */}
        <div className="pointer-events-none absolute left-6 top-12 hidden sm:block">
          <div className="h-14 w-10 rounded-full bg-primary/70 shadow-glow" />
          <div className="mx-auto mt-1 h-10 w-px bg-primary/40" />
        </div>
        <div className="pointer-events-none absolute right-10 top-20 hidden sm:block">
          <div className="h-12 w-9 rounded-full bg-amber-400/70 shadow" />
          <div className="mx-auto mt-1 h-10 w-px bg-amber-400/40" />
        </div>
        <div className="pointer-events-none absolute right-28 top-10 hidden md:block">
          <div className="h-16 w-11 rounded-full bg-emerald-400/60 shadow" />
          <div className="mx-auto mt-1 h-12 w-px bg-emerald-400/30" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Gift className="h-3.5 w-3.5 text-primary" /> A one-day birthday surprise
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Happy Birthday, Pa
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Unbox your gift to continue to the Brynier landing page.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2">
            {/* Gift box */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-6 shadow-elev">
              <div className="mx-auto flex max-w-sm flex-col items-center">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h3l2-6 4 12 2-6h5" />
                  </svg>
                </div>

                <div className="relative w-full">
                  <div className="mx-auto h-10 w-40 rounded-t-2xl border border-border bg-background/60" />
                  <div className="mx-auto -mt-1 h-40 w-full max-w-sm rounded-2xl border border-border bg-background/60 shadow-sm" />

                  {/* Ribbon */}
                  <div className="pointer-events-none absolute left-1/2 top-7 h-40 w-8 -translate-x-1/2 rounded bg-primary/60" />
                  <div className="pointer-events-none absolute left-1/2 top-24 h-8 w-full max-w-sm -translate-x-1/2 rounded bg-primary/35" />

                  {/* Bow */}
                  <div className="pointer-events-none absolute left-1/2 top-2 h-10 w-10 -translate-x-1/2 rounded-full bg-primary/45 blur-[0.5px]" />
                </div>

                <Button className="mt-6 w-full" size="lg" onClick={onUnbox}>
                  Unbox the gift <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Visible only on 25 May 2026 (00:00–12:00 SAST).
                </p>
              </div>
            </div>

            {/* Birthday card */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-6 shadow-elev">
              <p className="text-sm font-medium uppercase tracking-widest text-primary">Birthday card</p>
              <div className="mt-4 rounded-xl border border-border bg-background/60 p-5">
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{message}</p>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                (If you refresh later, it will disappear automatically after midday.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
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
              Brynier is a project companion for DIY electronics makers. Document components, wiring,
              code and journal entries — then troubleshoot with an AI that understands your build.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="shadow-glow">
                <Link to="/signup">
                  Start a project free <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login" search={{ redirect: "/dashboard" }}>I already have an account</Link>
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
                <span className="ml-3 text-xs text-muted-foreground">Brynier.app/projects/dog-feeder</span>
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
          <span>© {new Date().getFullYear()} Brynier</span>
          <span>Made for makers</span>
        </div>
      </footer>
    </div>
  );
}

function Landing() {
  const [mounted, setMounted] = useState(false);
  const [unboxed, setUnboxed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setUnboxed(window.localStorage.getItem(GIFT_STORAGE_KEY) === "1");
    } catch {
      setUnboxed(false);
    }
  }, []);

  const showGift = useMemo(() => {
    if (!mounted) return false;
    if (unboxed) return false;
    try {
      return isBirthdayWindow();
    } catch {
      return false;
    }
  }, [mounted, unboxed]);

  if (showGift) {
    return (
      <BirthdayGate
        onUnbox={() => {
          try {
            window.localStorage.setItem(GIFT_STORAGE_KEY, "1");
          } catch {
            // ignore
          }
          setUnboxed(true);
        }}
      />
    );
  }

  return <LandingPage />;
}