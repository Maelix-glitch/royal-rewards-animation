import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Crown, Gem, Flame, Sparkles, Lock, Check, Trophy, Star, Shield } from "lucide-react";
import crownCrest from "@/assets/crown-crest.png";
import filigree from "@/assets/filigree-divider.png";
import velvet from "@/assets/velvet-texture.jpg";
import type { MouseEvent as ReactMouseEvent } from "react";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Bloom Rewards — Royal Tiers, Ranks & Treasures" },
      {
        name: "description",
        content:
          "Climb the Bloom court: earn petals, unlock royal reward tiers, claim treasures and rise through the ranks with streaks and seasonal honours.",
      },
      { property: "og:title", content: "Bloom Rewards — Royal Tiers, Ranks & Treasures" },
      {
        property: "og:description",
        content: "Earn petals, unlock royal tiers and claim treasures in the Bloom court.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RewardsPage,
});

const NAV = ["Today", "Trackers", "Cycle", "Mood", "Rewards", "Coach"];

type Tier = {
  name: string;
  rank: string;
  petals: number;
  perk: string;
  icon: typeof Crown;
  hue: string;
};

const TIERS: Tier[] = [
  { name: "Seedling", rank: "I", petals: 0, perk: "Daily petal bonus", icon: Sparkles, hue: "150" },
  { name: "Blossom", rank: "II", petals: 800, perk: "Custom tracker themes", icon: Star, hue: "330" },
  { name: "Emerald", rank: "III", petals: 2200, perk: "Cycle insight reports", icon: Shield, hue: "160" },
  { name: "Sapphire", rank: "IV", petals: 4600, perk: "Coach priority replies", icon: Gem, hue: "250" },
  { name: "Amethyst", rank: "V", petals: 8200, perk: "Seasonal reward vault", icon: Trophy, hue: "300" },
  { name: "Sovereign", rank: "VI", petals: 14000, perk: "Court of Bloom access", icon: Crown, hue: "85" },
];

const TREASURES = [
  { title: "Gilded Streak Shield", cost: 600, note: "Protects one missed day", state: "ready" },
  { title: "Moonlit Theme", cost: 1500, note: "Rare interface skin", state: "ready" },
  { title: "Coach Deep Dive", cost: 3200, note: "60-min guided session", state: "locked" },
  { title: "Crown of the Season", cost: 9000, note: "Sovereign-only relic", state: "locked" },
];

const COURT = [
  { name: "Alina R.", petals: 18420, rank: "Sovereign" },
  { name: "Priya M.", petals: 12980, rank: "Amethyst" },
  { name: "You", petals: 6240, rank: "Sapphire" },
  { name: "Noor K.", petals: 5110, rank: "Sapphire" },
  { name: "Jules T.", petals: 3980, rank: "Emerald" },
];

const CURRENT_PETALS = 6240;

const HONOURS = [
  "28-day streak kept",
  "Cycle logged 6 months",
  "First Sapphire ascent",
  "100 mood entries",
  "Coach session completed",
  "Season of Gold participant",
];

function handleTilt(e: ReactMouseEvent<HTMLElement>) {
  if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--ry", `${px * 10}deg`);
  el.style.setProperty("--rx", `${-py * 10}deg`);
  el.style.setProperty("--ty", "-8px");
}

function resetTilt(e: ReactMouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.setProperty("--ry", "0deg");
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ty", "0px");
}

function RewardsPage() {
  const [mounted, setMounted] = useState(false);
  const [petals, setPetals] = useState(0);
  const [claimed, setClaimed] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setPetals(Math.round(CURRENT_PETALS * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { current, next, progress } = useMemo(() => {
    const idx = TIERS.reduce((acc, t, i) => (CURRENT_PETALS >= t.petals ? i : acc), 0);
    const cur = TIERS[idx]!;
    const nxt = TIERS[Math.min(idx + 1, TIERS.length - 1)]!;
    const span = Math.max(1, nxt.petals - cur.petals);
    return {
      current: cur,
      next: nxt,
      progress: Math.min(1, (CURRENT_PETALS - cur.petals) / span),
    };
  }, []);

  const ring = 2 * Math.PI * 84;

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 md:px-10">
      <Aurora />
      <VelvetVeil />
      <Embers />
      <CursorGlow />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Header */}
        <header className="mb-14 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="relative grid size-10 place-items-center rounded-full border border-gold/40">
              <span className="absolute inset-0 rounded-full bg-gold/10 [animation:halo-pulse_4s_ease-in-out_infinite]" />
              <Crown className="size-5 text-gold" />
            </span>
            <span className="font-display text-2xl tracking-wide text-gold-soft">Bloom</span>
          </div>
          <nav aria-label="Main navigation" className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
            {NAV.map((item) => (
              <span
                key={item}
                className={
                  item === "Rewards"
                    ? "relative text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-[image:var(--gradient-gold)]"
                    : "cursor-default text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {item}
              </span>
            ))}
          </nav>
        </header>

        {/* Hero */}
        <section
          className="royal-card mb-16 grid gap-10 p-8 md:grid-cols-[auto_1fr] md:items-center md:p-12"
          style={{ animation: mounted ? "rise-in .9s cubic-bezier(.2,.8,.2,1) both" : undefined }}
        >
          <Shimmer />
          <div className="relative mx-auto grid place-items-center">
            <div
              className="absolute size-64 rounded-full blur-2xl"
              style={{
                background: "radial-gradient(circle, oklch(0.85 0.14 88 / .35), transparent 65%)",
                animation: "halo-pulse 5s ease-in-out infinite",
              }}
            />
            <svg viewBox="0 0 200 200" className="size-56 -rotate-90">
              <circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" strokeWidth="6" className="text-border/60" />
              <circle
                cx="100"
                cy="100"
                r="84"
                fill="none"
                stroke="url(#goldArc)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={ring}
                strokeDashoffset={ring - ring * (mounted ? progress : 0)}
                style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(.2,.8,.2,1)" }}
              />
              <defs>
                <linearGradient id="goldArc" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.11 70)" />
                  <stop offset="50%" stopColor="oklch(0.95 0.1 95)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.16 300)" />
                </linearGradient>
              </defs>
            </svg>
            <img
              src={crownCrest}
              alt="Royal Bloom crest"
              width={816}
              height={816}
              className="absolute size-36 object-contain drop-shadow-[0_18px_40px_oklch(0.85_0.14_88/0.35)]"
              style={{ animation: "float-slow 7s ease-in-out infinite, crest-glimmer 5s ease-in-out infinite" }}
            />
          </div>

          <div>
            <p className="mb-3 text-[0.65rem] uppercase tracking-[0.3em] sm:text-xs sm:tracking-[0.4em] text-muted-foreground">Season of Gold · Rank {current.rank}</p>
            <h1 className="text-gold text-4xl leading-[1.05] sm:text-5xl md:text-6xl">{current.name} Court</h1>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Every logged day, tracked cycle and honest mood entry earns petals. Petals crown your rank,
              and rank unlocks the vault.
            </p>

            <div className="mt-8 flex flex-wrap items-end gap-8">
              <div>
                <div
                  className="font-display text-4xl text-gold-soft sm:text-5xl"
                  style={{ animation: "count-glow 3.5s ease-in-out infinite" }}
                >
                  {petals.toLocaleString()}
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Petals</div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-background/40 px-4 py-2">
                <Flame className="size-4 text-gold" />
                <span className="text-sm">28-day streak</span>
              </div>
            </div>

            <div className="mt-7">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>{current.name}</span>
                <span>{(next.petals - CURRENT_PETALS).toLocaleString()} petals to {next.name}</span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-[image:var(--gradient-gold)]"
                  style={{
                    width: mounted ? `${progress * 100}%` : "0%",
                    transition: "width 1.8s cubic-bezier(.2,.8,.2,1)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tiers */}
        <SectionTitle eyebrow="The Ladder" title="Reward Tiers" />
        <div className="mb-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((tier, i) => {
            const unlocked = CURRENT_PETALS >= tier.petals;
            const Icon = tier.icon;
            return (
              <article
                key={tier.name}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                className="royal-card tilt-card group p-6 hover:border-gold/60 hover:shadow-[var(--shadow-gold)]"
                style={{ animation: `rise-in .7s cubic-bezier(.2,.8,.2,1) both`, animationDelay: `${i * 90}ms` }}
              >
                <Shimmer />
                <div
                  className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-90"
                  style={{ background: `radial-gradient(circle, oklch(0.7 0.16 ${tier.hue} / .6), transparent 70%)` }}
                />
                <div className="relative flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-xl border border-gold/25 bg-background/40">
                    <Icon className="size-5 text-gold" />
                  </span>
                  <span className="font-display text-3xl text-muted-foreground/60">{tier.rank}</span>
                </div>
                <h3 className="relative mt-5 text-2xl text-foreground">{tier.name}</h3>
                <p className="relative mt-1 text-sm text-muted-foreground">{tier.perk}</p>
                <div className="relative mt-6 flex items-center justify-between text-sm">
                  <span className="text-gold-soft">{tier.petals.toLocaleString()} petals</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
                      unlocked
                        ? "border border-gold/40 bg-gold/10 text-gold-soft"
                        : "border border-border bg-background/40 text-muted-foreground"
                    }`}
                  >
                    {unlocked ? <Check className="size-3" /> : <Lock className="size-3" />}
                    {unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <Divider />
        <HonoursMarquee />
        <Divider />

        {/* Treasury */}
        <SectionTitle eyebrow="The Vault" title="Claim Your Treasures" />
        <div className="mb-20 grid gap-5 md:grid-cols-2">
          {TREASURES.map((t, i) => {
            const claimedAt = claims[t.title];
            const remaining = claimedAt ? Math.max(0, claimedAt + COOLDOWN_MS - now) : 0;
            const cooling = remaining > 0;
            const locked = t.state === "locked";
            return (
              <div
                key={t.title}
                className="royal-card flex flex-col items-start justify-between gap-4 p-6 hover:-translate-y-1 sm:flex-row sm:items-center sm:gap-5"
                style={{ animation: `rise-in .7s cubic-bezier(.2,.8,.2,1) both`, animationDelay: `${i * 80}ms` }}
              >
                <Shimmer />
                <div className="relative">
                  <h3 className="text-xl">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.note}</p>
                  <p className="mt-2 text-sm text-gold-soft">{t.cost.toLocaleString()} petals</p>
                  {cooling && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Timer className="size-3.5 text-gold/70" />
                      Next claim in {formatCooldown(remaining)}
                    </p>
                  )}
                </div>
                <button
                  disabled={locked || cooling}
                  aria-label={`${locked ? "Locked" : cooling ? "On cooldown" : "Claim"}: ${t.title}`}
                  onClick={() => setActive(t.title)}
                  className={`relative shrink-0 overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    locked
                      ? "cursor-not-allowed border border-border text-muted-foreground"
                      : cooling
                        ? "cursor-not-allowed border border-gold/30 bg-gold/5 text-muted-foreground"
                        : "bg-[image:var(--gradient-gold)] text-primary-foreground hover:scale-105 hover:shadow-[var(--shadow-gold)]"
                  }`}
                >
                  {locked ? "Locked" : cooling ? formatCooldown(remaining) : "Claim"}
                </button>
              </div>
            );
          })}
        </div>

        {activeTreasure && (
          <ClaimModal
            treasure={activeTreasure}
            claimed={Boolean(claims[activeTreasure.title])}
            onClaim={() => setClaims((c) => ({ ...c, [activeTreasure.title]: Date.now() }))}
            onClose={() => setActive(null)}
          />
        )}


        {/* Court ranking */}
        <SectionTitle eyebrow="The Court" title="Rank Standings" />
        <div className="royal-card mb-14 divide-y divide-border/60 p-2">
          <Shimmer />
          {COURT.map((m, i) => (
            <div
              key={m.name}
              className={`relative flex items-center gap-4 px-5 py-4 transition-colors ${
                m.name === "You" ? "rounded-xl bg-gold/5" : ""
              }`}
            >
              <span className="font-display w-8 text-2xl text-muted-foreground/70">{i + 1}</span>
              <span className="grid size-9 place-items-center rounded-full border border-gold/25 bg-background/40 text-xs text-gold">
                {m.name.charAt(0)}
              </span>
              <span className="flex-1">{m.name}</span>
              <span className="hidden text-sm text-muted-foreground sm:block">{m.rank}</span>
              <span className="w-28 text-right text-gold-soft">{m.petals.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <Divider />
        <footer className="pb-10 text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Bloom · Season of Gold
        </footer>
      </div>
    </main>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-7">
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{eyebrow}</p>
      <h2 className="text-gold mt-1 text-3xl sm:text-4xl">{title}</h2>
    </div>
  );
}

function Shimmer() {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <span
        className="absolute inset-y-0 w-1/3 bg-[linear-gradient(90deg,transparent,oklch(1_0_0/.07),transparent)]"
        style={{ animation: "shimmer-sweep 6s ease-in-out infinite" }}
      />
    </span>
  );
}

function SparkBurst() {
  const bits = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return { x: Math.cos(a) * 46, y: Math.sin(a) * 46, d: i * 0.03 };
  });
  return (
    <span className="pointer-events-none absolute inset-0">
      <span
        className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60"
        style={{ animation: "ring-ripple 1.4s ease-out infinite" }}
      />
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 size-1.5 rounded-full bg-gold-soft"
          style={{
            ["--bx" as string]: `${b.x}px`,
            ["--by" as string]: `${b.y}px`,
            animation: `burst-out 1.2s ease-out ${b.d}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <span
        className="absolute -left-1/4 -top-1/3 size-[70vmax] rounded-full blur-[120px] opacity-40"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.19 295 / .6), transparent 65%)",
          animation: "aurora-drift 26s ease-in-out infinite",
        }}
      />
      <span
        className="absolute -right-1/4 top-1/4 size-[60vmax] rounded-full blur-[130px] opacity-30"
        style={{
          background: "radial-gradient(circle, oklch(0.85 0.14 88 / .45), transparent 65%)",
          animation: "aurora-drift 34s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}

function VelvetVeil() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-[0.14] mix-blend-soft-light"
      style={{
        backgroundImage: `url(${velvet})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

function Embers() {
  const embers = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        left: (i * 37) % 100,
        size: 2 + ((i * 7) % 5),
        delay: (i * 1.37) % 16,
        dur: 14 + ((i * 3) % 12),
        drift: ((i % 5) - 2) * 60,
      })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-gold-soft"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            filter: "blur(0.5px)",
            boxShadow: "0 0 12px oklch(0.9 0.13 90 / .8)",
            ["--drift" as string]: `${e.drift}px`,
            animation: `ember-rise ${e.dur}s linear ${e.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: -400, y: -400 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
      style={{
        background: `radial-gradient(340px circle at ${pos.x}px ${pos.y}px, oklch(0.85 0.14 88 / .1), transparent 70%)`,
      }}
    />
  );
}

function Divider() {
  return (
    <div className="my-14 flex justify-center">
      <img
        src={filigree}
        alt=""
        aria-hidden
        loading="lazy"
        width={1536}
        height={512}
        className="h-16 w-full max-w-2xl object-contain opacity-70"
        style={{ animation: "halo-pulse 7s ease-in-out infinite" }}
      />
    </div>
  );
}

function HonoursMarquee() {
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max gap-10" style={{ animation: "marquee-x 32s linear infinite" }}>
        {[...HONOURS, ...HONOURS].map((h, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap text-sm text-muted-foreground">
            <Sparkles className="size-3.5 text-gold" />
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}
