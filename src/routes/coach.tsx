import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Compass,
  Crown,
  Feather,
  Flame,
  Heart,
  ListChecks,
  Moon,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "Bloom Coach — A Second Mind for Your Day" },
      {
        name: "description",
        content:
          "Choose a lens, ask a real question, and see exactly which signals shape the answer. Bloom Coach is private by default and never guesses what you haven't logged.",
      },
      { property: "og:title", content: "Bloom Coach — A Second Mind for Your Day" },
      {
        property: "og:description",
        content:
          "A quiet conversational space for your real life: lenses, context you control, and answers grounded in your own signals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoachPage,
});

const NAV = ["Today", "Trackers", "Cycle", "Mood", "Rewards", "Coach"];

const LENSES = [
  {
    id: "ask",
    label: "Ask",
    icon: Compass,
    blurb: "Get a clear read on what's in front of you.",
    opener:
      "Tell me what's on your plate today. I'll work from what you've actually logged — and I'll say so plainly when something isn't there.",
    prompts: ["Why am I so flat this afternoon?", "Is my sleep the problem this week?"],
  },
  {
    id: "reflect",
    label: "Reflect",
    icon: Feather,
    blurb: "Slow down and name what's underneath.",
    opener:
      "No fixing yet. Start anywhere — the messy sentence is usually the honest one. I'll keep it, and hand it back to you when it matters.",
    prompts: ["Something felt off after that call.", "I keep putting off the same thing."],
  },
  {
    id: "plan",
    label: "Plan",
    icon: ListChecks,
    blurb: "Turn insight into one next move.",
    opener:
      "Let's make it small enough to actually happen. Give me the week you're walking into and we'll pick the one thing worth protecting.",
    prompts: ["Help me protect two evenings.", "Shape a realistic week from here."],
  },
] as const;

const SIGNALS = [
  { label: "Mood baseline", value: 6, icon: Heart, note: "steady, slightly low" },
  { label: "Energy", value: 4, icon: Flame, note: "dipping since Tuesday" },
  { label: "Sleep debt", value: 7, icon: Moon, note: "two short nights" },
];

const MEMORY = [
  "You do your clearest thinking before 11am.",
  "Late workouts have cost you sleep twice this month.",
  "You asked to be nudged, not nagged.",
];

type Turn = { who: "coach" | "you"; text: string };

function CoachPage() {
  const [lensId, setLensId] = useState<(typeof LENSES)[number]["id"]>("ask");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [useMemory, setUseMemory] = useState(true);
  const threadRef = useRef<HTMLDivElement>(null);

  const lens = useMemo(() => LENSES.find((l) => l.id === lensId)!, [lensId]);

  useEffect(() => {
    setTurns([]);
    setThinking(false);
  }, [lensId]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, thinking]);

  const contextPct = 34 + (useMemory ? 26 : 0) + Math.min(turns.length * 6, 24);

  function send(text: string) {
    const message = text.trim();
    if (!message || thinking) return;
    setTurns((t) => [...t, { who: "you", text: message }]);
    setDraft("");
    setThinking(true);
    window.setTimeout(() => {
      setTurns((t) => [
        ...t,
        {
          who: "coach",
          text:
            lensId === "reflect"
              ? "Sat with that. The part I'd underline is the bit you said last, almost in passing — that's usually where the weight is. What would change if you took it at face value?"
              : lensId === "plan"
                ? "Here's the honest version: one anchor, not five. Protect tomorrow morning, move the evening session to Saturday, and let the rest be optional. I'll hold you to the first one only."
                : "Two short nights and a flat afternoon usually travel together, and your logs back that up. Nothing here says burnout — it says debt. Want to look at the last four days side by side?",
        },
      ]);
      setThinking(false);
    }, 900);
  }

  return (
    <main className="relative min-h-screen px-5 py-8 md:px-10">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="relative grid size-10 place-items-center rounded-full border border-gold/40">
              <span className="absolute inset-0 rounded-full bg-gold/10 [animation:halo-pulse_4s_ease-in-out_infinite]" />
              <Crown className="size-5 text-gold" />
            </span>
            <span className="font-display text-2xl tracking-wide text-gold-soft">Bloom</span>
          </div>
          <nav aria-label="Main navigation" className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
            {NAV.map((item) =>
              item === "Coach" ? (
                <span
                  key={item}
                  className="relative text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-[image:var(--gradient-gold)]"
                >
                  {item}
                </span>
              ) : item === "Rewards" ? (
                <Link key={item} to="/rewards" className="text-muted-foreground transition-colors hover:text-foreground">
                  {item}
                </Link>
              ) : (
                <span key={item} className="cursor-default text-muted-foreground transition-colors hover:text-foreground">
                  {item}
                </span>
              ),
            )}
          </nav>
        </header>

        {/* Intro */}
        <section className="mb-10 max-w-2xl">
          <p className="mb-4 flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-gold" />
            Bloom Coach / private intelligence
          </p>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            A second mind
            <br />
            <span className="text-gold">for your day.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            A conversational space for your real life. Choose a lens, ask a question, and see exactly
            which signals shape the response.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)_16rem]">
          {/* Lens rail */}
          <aside className="space-y-6">
            <div className="royal-card p-4">
              <p className="mb-3 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
                Coach lenses <Sparkles className="size-3.5 text-gold" />
              </p>
              <div className="space-y-2">
                {LENSES.map((l) => {
                  const Icon = l.icon;
                  const active = l.id === lensId;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setLensId(l.id)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                        active
                          ? "border-gold/40 bg-secondary/70 shadow-[var(--shadow-gold)]"
                          : "border-border/60 hover:border-gold/25 hover:bg-secondary/40"
                      }`}
                    >
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-lg border ${
                          active ? "border-gold/50 text-gold" : "border-border text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-foreground">{l.label}</span>
                        <span className="block truncate text-xs text-muted-foreground">{l.blurb}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="royal-card p-4">
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
                Context envelope
              </p>
              <label className="flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={useMemory}
                  onChange={(e) => setUseMemory(e.target.checked)}
                  className="mt-0.5 accent-[oklch(0.82_0.135_85)]"
                />
                <span>
                  Let the coach use your memory layer. Turn it off and it answers from this thread only.
                </span>
              </label>
              <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                <span>Next response context</span>
                <span className="text-gold">{contextPct}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-border/70">
                <div
                  className="h-full rounded-full bg-[image:var(--gradient-gold)] transition-[width] duration-700"
                  style={{ width: `${contextPct}%` }}
                />
              </div>
            </div>
          </aside>

          {/* Conversation */}
          <section className="royal-card flex min-h-[32rem] flex-col p-5 md:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full border border-gold/40 text-gold">
                  <lens.icon className="size-5" />
                </span>
                <div>
                  <h2 className="font-display text-2xl leading-tight">{lens.label} with Bloom</h2>
                  <p className="text-xs text-muted-foreground">{lens.blurb}</p>
                </div>
              </div>
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                {turns.length} turns
              </span>
            </div>

            <div ref={threadRef} className="flex-1 space-y-4 overflow-y-auto pr-1">
              <Bubble who="coach">{lens.opener}</Bubble>
              {turns.map((t, i) => (
                <Bubble key={i} who={t.who}>
                  {t.text}
                </Bubble>
              ))}
              {thinking && (
                <div className="flex items-center gap-2 pl-12 text-xs text-muted-foreground">
                  <span className="size-1.5 animate-bounce rounded-full bg-gold [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-gold [animation-delay:120ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-gold [animation-delay:240ms]" />
                  <span className="ml-1">reading your signals</span>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                {lens.prompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(draft);
                }}
                className="flex items-center gap-2 rounded-2xl border border-border/70 bg-secondary/40 p-2 transition-colors focus-within:border-gold/40"
              >
                <label htmlFor="coach-input" className="sr-only">
                  Write to your coach
                </label>
                <input
                  id="coach-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Say it plainly — ${lens.label.toLowerCase()} mode`}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || thinking}
                  className="grid size-10 place-items-center rounded-xl border border-gold/40 text-gold transition-all hover:bg-gold/10 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </button>
              </form>
              <p className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-gold/80" /> Private by default. Nothing here leaves
                your record.
              </p>
            </div>
          </section>

          {/* Signal rail */}
          <aside className="space-y-6">
            <div className="royal-card p-4">
              <p className="mb-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
                Signal rail <span className="text-gold">live</span>
              </p>
              <div className="space-y-4">
                {SIGNALS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="rounded-xl border border-border/60 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                          {s.label}
                        </span>
                        <Icon className="size-3.5 text-gold/80" />
                      </div>
                      <p className="mt-1 font-display text-2xl text-foreground">
                        {s.value}
                        <span className="text-sm text-muted-foreground">/10</span>
                      </p>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-border/70">
                        <div
                          className="h-full rounded-full bg-[image:var(--gradient-gold)]"
                          style={{ width: `${s.value * 10}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{s.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="royal-card p-4">
              <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
                Memory layer
              </p>
              <ul className="space-y-3 text-xs leading-relaxed text-muted-foreground">
                {MEMORY.map((m) => (
                  <li key={m} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold" />
                    <span className={useMemory ? "" : "line-through opacity-50"}>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Bubble({ who, children }: { who: "coach" | "you"; children: React.ReactNode }) {
  const isCoach = who === "coach";
  return (
    <div
      className={`flex gap-3 ${isCoach ? "" : "flex-row-reverse"}`}
      style={{ animation: "rise-in .5s cubic-bezier(.2,.8,.2,1) both" }}
    >
      <span
        className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full border ${
          isCoach ? "border-gold/40 text-gold" : "border-border text-muted-foreground"
        }`}
      >
        {isCoach ? <Sparkles className="size-4" /> : <span className="text-xs">You</span>}
      </span>
      <div
        className={`max-w-[85%] rounded-2xl border p-4 text-sm leading-relaxed ${
          isCoach
            ? "border-gold/20 bg-secondary/50 text-foreground"
            : "border-border/70 bg-background/40 text-foreground"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
