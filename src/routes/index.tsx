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
    <div className="min-h-screen overflow-hidden bg-background">
      <Header />

      <style>{`
        @keyframes brynier-sparkle-pop {
          0% { transform: translate(var(--x0), var(--y0)) scale(0.2) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translate(var(--x1), var(--y1)) scale(1.1) rotate(240deg); opacity: 0; }
        }
        .brynier-sparkle {
          animation: brynier-sparkle-pop 900ms ease-out forwards;
          will-change: transform, opacity;
        }
      `}</style>

      <div className="relative">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-96 bg-gradient-hero opacity-[0.10]" />

        {/* Decorative blobs */}
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

        {/* Main stage: lock to viewport (minus header) so it never scrolls */}
        <div className="relative mx-auto flex h-[calc(100vh-3.5rem)] max-w-6xl flex-col items-center justify-center px-4 sm:px-6">
          <div className="mx-auto w-full max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Gift className="h-3.5 w-3.5 text-primary" /> A one-day birthday surprise
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Happy Birthday, Pa
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Tap “Unbox the gift” to reveal Brynier.
            </p>
          </div>

          {/* Gift box + attached card */}
          <div className="relative mt-8 w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-card p-6 shadow-elev sm:p-10">
              {/* Attached card */}
              <div className="absolute left-6 top-6 z-10 w-[min(26rem,80%)] -rotate-2">
                <div className="relative rounded-2xl border border-border bg-background/80 p-5 shadow-sm backdrop-blur">
                  <div className="absolute -left-3 top-6 h-10 w-10 rotate-12 rounded-full bg-amber-300/50 blur-xl" />
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">Birthday card</p>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">{message}</p>
                </div>
                {/* Tape */}
                <div className="pointer-events-none absolute -right-4 -top-3 h-8 w-20 rotate-12 rounded bg-amber-200/30 blur-[0.2px]" />
              </div>

              {/* Box body (big) */}
              <div className="mx-auto mt-28 max-w-xl sm:mt-24">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h3l2-6 4 12 2-6h5" />
                  </svg>
                </div>

                <div className="relative mt-6">
                  <div className="mx-auto h-12 w-56 rounded-t-3xl border border-border bg-background/60" />
                  <div className="mx-auto -mt-2 h-72 w-full rounded-3xl border border-border bg-background/60 shadow-sm sm:h-80" />

                  {/* Ribbon */}
                  <div className="pointer-events-none absolute left-1/2 top-6 h-[calc(100%-2.5rem)] w-10 -translate-x-1/2 rounded bg-primary/55" />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-[92%] -translate-x-1/2 -translate-y-1/2 rounded bg-primary/30" />

                  {/* Bow */}
                  <div className="pointer-events-none absolute left-1/2 top-2 h-12 w-12 -translate-x-1/2 rounded-full bg-primary/45 blur-[0.5px]" />
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Visible only on 25 May 2026 (00:00–12:00 SAST).
                </p>
              </div>
            </div>
          </div>

          {/* Bottom-right button */}
          <div className="fixed bottom-5 right-5 z-20">
            <Button size="lg" className="shadow-glow" onClick={onUnbox}>
              Unbox the gift <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
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


function SparkleOverlay() {
  const sparks = [
    { x0: -10, y0: 10, x1: -140, y1: -120, s: 18, d: 0 },
    { x0: 0, y0: 0, x1: -60, y1: -180, s: 14, d: 80 },
    { x0: 12, y0: 18, x1: 40, y1: -160, s: 16, d: 40 },
    { x0: 18, y0: 0, x1: 160, y1: -120, s: 20, d: 10 },
    { x0: -8, y0: 0, x1: 120, y1: -40, s: 12, d: 120 },
    { x0: 0, y0: -8, x1: -120, y1: -40, s: 12, d: 140 },
    { x0: 0, y0: 0, x1: 20, y1: 180, s: 10, d: 90 },
    { x0: 0, y0: 0, x1: -20, y1: 180, s: 10, d: 110 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
      <div className="absolute left-1/2 top-1/2">
        {sparks.map((sp, i) => (
          <div
            key={i}
            className="brynier-sparkle absolute"
            style={{
              width: sp.s,
              height: sp.s,
              borderRadius: 9999,
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,1), rgba(255,255,255,0) 65%)",
              boxShadow: "0 0 22px rgba(79,70,229,0.45)",
              transform: `translate(${sp.x0}px, ${sp.y0}px)`,
              ['--x0' as any]: `${sp.x0}px`,
              ['--y0' as any]: `${sp.y0}px`,
              ['--x1' as any]: `${sp.x1}px`,
              ['--y1' as any]: `${sp.y1}px`,
              animationDelay: `${sp.d}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}function Landing() {
  const [mounted, setMounted] = useState(false);
  const [unboxed, setUnboxed] = useState(false);
  const [revealing, setRevealing] = useState(false);

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
    if (revealing) return false;
    try {
      return isBirthdayWindow();
    } catch {
      return false;
    }
  }, [mounted, unboxed, revealing]);

  if (showGift) {
    return (
      <>
        {revealing ? <SparkleOverlay /> : null}
        <BirthdayGate
          onUnbox={() => {
            setRevealing(true);
            window.setTimeout(() => {
              try {
                window.localStorage.setItem(GIFT_STORAGE_KEY, "1");
              } catch {
                // ignore
              }
              setUnboxed(true);
              setRevealing(false);
            }, 850);
          }}
        />
      </>
    );
  }

  return <LandingPage />;
}