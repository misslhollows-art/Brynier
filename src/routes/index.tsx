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

  const balloons = [
    { left: 6, top: 10, hue: 330, s: 1.0, dur: 8.2, delay: 0.0 },
    { left: 12, top: 26, hue: 55, s: 0.9, dur: 9.4, delay: 0.6 },
    { left: 18, top: 14, hue: 160, s: 1.05, dur: 8.8, delay: 1.2 },
    { left: 26, top: 6, hue: 210, s: 0.95, dur: 10.0, delay: 0.4 },
    { left: 34, top: 18, hue: 285, s: 1.1, dur: 8.6, delay: 0.9 },
    { left: 44, top: 8, hue: 35, s: 1.0, dur: 9.8, delay: 0.2 },
    { left: 54, top: 16, hue: 120, s: 0.92, dur: 10.4, delay: 0.7 },
    { left: 64, top: 7, hue: 190, s: 1.08, dur: 9.2, delay: 1.0 },
    { left: 74, top: 18, hue: 20, s: 0.9, dur: 11.0, delay: 0.3 },
    { left: 82, top: 10, hue: 260, s: 1.02, dur: 9.6, delay: 0.8 },
    { left: 88, top: 28, hue: 95, s: 0.88, dur: 10.6, delay: 1.4 },
    { left: 92, top: 14, hue: 300, s: 1.0, dur: 8.9, delay: 0.5 },
  ] as const;

  const streamers = [
    { left: 8, rot: -10, w: 120, h: 14, hue: 40, dur: 6.2, delay: 0.0 },
    { left: 26, rot: 8, w: 160, h: 14, hue: 200, dur: 7.2, delay: 0.6 },
    { left: 48, rot: -6, w: 140, h: 14, hue: 320, dur: 6.8, delay: 0.2 },
    { left: 68, rot: 12, w: 150, h: 14, hue: 120, dur: 7.4, delay: 0.9 },
    { left: 86, rot: -8, w: 130, h: 14, hue: 260, dur: 6.6, delay: 0.4 },
  ] as const;

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <style>{`
        @keyframes brynier-float {
          0% { transform: translate3d(0, 0, 0) scale(var(--s)) rotate(-2deg); }
          50% { transform: translate3d(12px, -14px, 0) scale(var(--s)) rotate(3deg); }
          100% { transform: translate3d(-8px, 6px, 0) scale(var(--s)) rotate(-2deg); }
        }
        @keyframes brynier-sway {
          0% { transform: translate3d(0,0,0) rotate(var(--r)); }
          50% { transform: translate3d(0,2px,0) rotate(calc(var(--r) * -1)); }
          100% { transform: translate3d(0,0,0) rotate(var(--r)); }
        }
        @keyframes brynier-sparkle-pop {
          0% { transform: translate(var(--x0), var(--y0)) scale(0.2) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translate(var(--x1), var(--y1)) scale(1.1) rotate(240deg); opacity: 0; }
        }
        .brynier-balloon {
          animation: brynier-float var(--dur) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform;
        }
        .brynier-streamer {
          animation: brynier-sway var(--dur) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform;
        }
        .brynier-sparkle {
          animation: brynier-sparkle-pop 900ms ease-out forwards;
          will-change: transform, opacity;
        }
      `}</style>

      <div className="relative">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-96 bg-gradient-hero opacity-[0.10]" />

        {/* Streamers */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44">
          {streamers.map((s, i) => (
            <div
              key={i}
              className="brynier-streamer absolute top-6 rounded-full opacity-70 blur-[0.2px]"
              style={{
                left: `${s.left}%`,
                width: `${s.w}px`,
                height: `${s.h}px`,
                ['--r' as any]: `${s.rot}deg`,
                ['--dur' as any]: `${s.dur}s`,
                ['--delay' as any]: `${s.delay}s`,
                transform: `rotate(${s.rot}deg)`,
                background: `linear-gradient(90deg, hsla(${s.hue}, 90%, 65%, 0.85), hsla(${(s.hue + 40) % 360}, 90%, 65%, 0.25))`,
              }}
            />
          ))}
        </div>

        {/* Balloons */}
        <div className="pointer-events-none absolute inset-0">
          {balloons.map((b, i) => (
            <div
              key={i}
              className="brynier-balloon absolute"
              style={{
                left: `${b.left}%`,
                top: `${b.top}%`,
                ['--s' as any]: b.s,
                ['--dur' as any]: `${b.dur}s`,
                ['--delay' as any]: `${b.delay}s`,
              }}
            >
              <div
                className="relative"
                style={{
                  width: 44,
                  height: 60,
                  borderRadius: 9999,
                  background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.85), hsla(${b.hue}, 90%, 62%, 0.95) 35%, hsla(${b.hue}, 90%, 52%, 0.95) 70%)`,
                  boxShadow: `0 14px 28px hsla(${b.hue}, 90%, 40%, 0.25)`,
                }}
              >
                <div
                  className="absolute left-1/2 top-[56px] h-10 w-px -translate-x-1/2"
                  style={{ background: `hsla(${b.hue}, 70%, 70%, 0.35)` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main stage: no nav, locked to viewport */}
        <div className="relative mx-auto flex h-screen max-w-6xl flex-col items-center justify-center px-4 sm:px-6">
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

          {/* Gift box stage */}
          <div className="relative mt-8 w-full max-w-5xl">
            {/* Ground shadow */}
            <div className="pointer-events-none absolute left-1/2 top-[74%] h-24 w-[min(42rem,92%)] -translate-x-1/2 rounded-full bg-black/20 blur-2xl" />

            <div className="relative mx-auto w-full max-w-3xl">
              {/* Box */}
              <div className="relative mx-auto w-full">
                <div className="brynier-giftbox relative mx-auto w-[min(34rem,92%)]">
                  {/* Lid */}
                  <div className="relative mx-auto h-24 w-full rounded-[2.25rem] bg-gradient-to-b from-red-500/95 to-red-600/95 shadow-elev">
                    {/* Lid highlight */}
                    <div className="pointer-events-none absolute inset-2 rounded-[2rem] bg-white/10" />
                    {/* Lid lip */}
                    <div className="pointer-events-none absolute bottom-0 left-4 right-4 h-3 rounded-b-[1.5rem] bg-black/10" />

                    {/* Top ribbon */}
                    <div className="pointer-events-none absolute left-1/2 top-0 h-full w-16 -translate-x-1/2 rounded-[2rem] bg-gradient-to-b from-yellow-200/95 to-yellow-400/90" />
                    <div className="brynier-ribbon-shine pointer-events-none absolute left-1/2 top-0 h-full w-16 -translate-x-1/2 rounded-[2rem]" />

                    {/* Bow (more 3D) */}
                    <div className="pointer-events-none absolute left-1/2 top-[-14px] -translate-x-1/2">
                      <div className="brynier-bow relative">
                        <div className="absolute -left-12 top-5 h-16 w-24 rounded-[999px] bg-gradient-to-br from-yellow-200 to-yellow-500 shadow" style={{ transform: "rotate(-18deg)" }} />
                        <div className="absolute -right-12 top-5 h-16 w-24 rounded-[999px] bg-gradient-to-bl from-yellow-200 to-yellow-500 shadow" style={{ transform: "rotate(18deg)" }} />
                        <div className="absolute -left-6 top-0 h-16 w-20 rounded-[999px] bg-gradient-to-br from-yellow-100 to-yellow-400 shadow" style={{ transform: "rotate(-38deg)" }} />
                        <div className="absolute -right-6 top-0 h-16 w-20 rounded-[999px] bg-gradient-to-bl from-yellow-100 to-yellow-400 shadow" style={{ transform: "rotate(38deg)" }} />
                        <div className="absolute left-1/2 top-10 h-10 w-10 -translate-x-1/2 rounded-full bg-gradient-to-b from-yellow-100 to-yellow-400 shadow" />
                      </div>
                    </div>
                  </div>

                  {/* Box body */}
                  <div className="relative mx-auto -mt-6 h-[28rem] w-[min(34rem,92%)] rounded-[2.25rem] bg-gradient-to-b from-red-600/95 to-red-700/95 shadow-elev sm:h-[32rem]">
                    {/* Inner highlight */}
                    <div className="pointer-events-none absolute inset-3 rounded-[2rem] bg-white/6" />

                    {/* Side shading */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-10 rounded-l-[2.25rem] bg-black/10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-[2.25rem] bg-white/5" />

                    {/* Vertical ribbon */}
                    <div className="pointer-events-none absolute left-1/2 top-0 h-full w-16 -translate-x-1/2 bg-gradient-to-b from-yellow-200/95 to-yellow-500/90" />

                    {/* Horizontal ribbon */}
                    <div className="pointer-events-none absolute left-1/2 top-[45%] h-14 w-[94%] -translate-x-1/2 rounded-[2rem] bg-gradient-to-r from-yellow-200/70 via-yellow-300/70 to-yellow-200/70" />

                    {/* Note attached ON the box */}
                    <div className="absolute left-6 top-12 z-10 w-[min(28rem,78%)] -rotate-2">
                      <div className="relative rounded-2xl border border-border bg-background/85 p-5 shadow-sm backdrop-blur">
                        <p className="text-xs font-medium uppercase tracking-widest text-primary">Birthday card</p>
                        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">{message}</p>
                      </div>
                      <div className="pointer-events-none absolute -right-4 -top-3 h-8 w-20 rotate-12 rounded bg-amber-200/30 blur-[0.2px]" />
                    </div>

                    {/* Logo mark on box */}
                    <div className="pointer-events-none absolute bottom-7 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-xl bg-white/10 text-white">
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12h3l2-6 4 12 2-6h5" />
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-center text-xs text-muted-foreground">
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