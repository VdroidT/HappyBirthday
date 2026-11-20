import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Delete, Heart, X, RotateCcw } from "lucide-react";
import pandaSleep from "@/assets/panda-sleep.png";
import pandaHappy from "@/assets/panda-happy.png";
import m1 from "@/assets/memory-1.jpg";
import m2 from "@/assets/memory-2.jpg";
import m3 from "@/assets/memory-3.jpg";
import m4 from "@/assets/memory-4.jpg";
import m5 from "@/assets/memory-5.jpg";
import m6 from "@/assets/memory-6.jpg";
import m7 from "@/assets/memory-7.jpg";
import m8 from "@/assets/memory-8.jpg";
import m9 from "@/assets/memory-9.jpeg";
import m10 from "@/assets/memory-10.jpg";
import m11 from "@/assets/memory-11.jpg";
import m12 from "@/assets/memory-12.jpg";
import m13 from "@/assets/memory-13.jpg";
import m14 from "@/assets/memory-14.jpg";
import m15 from "@/assets/memory-15.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday My Love" },
      { name: "description", content: "A little birthday surprise, made with love." },
      { property: "og:title", content: "Happy Birthday My Love" },
      { property: "og:description", content: "A little birthday surprise, made with love." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------- Personal settings ---------- */
const PASSCODE = "2011";
const BIRTH_DATE = new Date(2004, 10, 20); // year, month (0 = Jan), day
const PROFILE = m1;
const MEMORIES = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15];
const MESSAGE = `Happy Birthday, Coco 💖

You are the most beautiful part of my life, and I'm so lucky to have you. Your smile makes my days better, and your presence makes everything feel special. I hope your birthday is filled with happiness, love, and endless smiles. 🥰

Always remember how much you mean to me. Today and every day, I choose you. 💕

Forever yours ❤️`;

type Step = "locked" | "keypad" | "opening" | "counter" | "memories" | "loading" | "letter" | "message";

function Index() {
  const [step, setStep] = useState<Step>("locked");
  const musicRef = useRef<HTMLAudioElement>(null);
  const startMusic = () => {
    const music = musicRef.current;
    if (music) {
      void music.play().catch((error: unknown) => {
        console.error("Could not start the background music:", error);
      });
    }
  };
  return (
    <main className="bg-romance relative min-h-screen overflow-hidden text-foreground">
      <audio
        ref={musicRef}
        src={`${import.meta.env.BASE_URL}birthday-song.mp3`}
        loop
        preload="none"
      />
      <Stars />
      <div key={step} className="animate-rise relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-10">
        {(step === "locked" || step === "keypad") && (
          <Lock keypad={step === "keypad"} onToggle={() => setStep(step === "locked" ? "keypad" : "locked")} onStartMusic={startMusic} onUnlock={() => setStep("opening")} />
        )}
        {step === "opening" && <Opening onStart={() => setStep("counter")} />}
        {step === "counter" && <Counter onNext={() => setStep("memories")} />}
        {step === "memories" && <Memories onNext={() => setStep("loading")} />}
        {step === "loading" && <Loading onDone={() => setStep("letter")} />}
        {step === "letter" && <Letter onOpen={() => setStep("message")} />}
        {step === "message" && <Message onRestart={() => setStep("locked")} />}
      </div>
    </main>
  );
}

function Stars() {
  const stars = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ l: (i * 37) % 100, t: (i * 53) % 100, d: (i % 5) + 2 })), []);
  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <span key={i} className="absolute h-1 w-1 rounded-full bg-rose" style={{ left: `${s.l}%`, top: `${s.t}%`, animation: `twinkle ${s.d}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

function Avatar({ big, onClick }: { big?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative flex flex-col items-center" aria-label="Show passkey entry">
      <img src={PROFILE} alt="My love" className={`rounded-full border-4 border-wine object-cover transition-all duration-500 ${big ? "h-36 w-36 shadow-[var(--glow)]" : "h-28 w-28"}`} />
      <Heart className="-mt-2 h-4 w-4 fill-primary text-primary" />
    </button>
  );
}

function Lock({ keypad, onToggle, onStartMusic, onUnlock }: { keypad: boolean; onToggle: () => void; onStartMusic: () => void; onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const press = (d: string) => {
    if (code.length >= 4) return;
    const next = code + d;
    setCode(next);
    if (next.length === 4) {
      if (next === PASSCODE) onStartMusic();
      setTimeout(() => {
        if (next === PASSCODE) onUnlock();
        else { setErr(true); setCode(""); setTimeout(() => setErr(false), 500); }
      }, 250);
    }
  };
  if (!keypad)
    return (
      <div className="flex flex-col items-center gap-8 text-center">
        <Avatar onClick={onToggle} />
        <h1 className="font-caps text-4xl tracking-[0.2em]">LOCKED</h1>
        <p className="text-sm text-muted-foreground">Click on picture above to reveal passkey entry •</p>
      </div>
    );
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Avatar big onClick={onToggle} />
      <div className="flex w-full items-center gap-3 text-[10px] tracking-[0.4em] text-primary">
        <span className="h-px flex-1 bg-border" />SECURE SYSTEM ENTRY<span className="h-px flex-1 bg-border" />
      </div>
      <div className={`flex h-20 w-full items-center justify-center gap-6 rounded-2xl border border-wine bg-background/70 ${err ? "animate-shake" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-3 w-3 rounded-full transition ${i < code.length ? "bg-rose-deep shadow-[var(--glow)]" : "bg-foreground/80"}`} />
        ))}
      </div>
      <div className="grid w-full grid-cols-3 gap-5 px-6">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => <Key key={d} onClick={() => press(d)}>{d}</Key>)}
        <Key onClick={() => setCode(code.slice(0, -1))}><Delete className="h-5 w-5" /></Key>
        <Key onClick={() => press("0")}>0</Key>
        <span className="flex items-center justify-center"><span className="h-2 w-2 rounded-full bg-primary" /></span>
      </div>
      <p className="text-[10px] tracking-[0.2em] text-muted-foreground/60">HINT: CLICK ON IMAGE AGAIN IF YOU FORGET PASSKEY</p>
    </div>
  );
}

function Key({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-wine bg-gradient-to-b from-wine to-background text-xl text-foreground/80 shadow-lg transition active:scale-90">
      {children}
    </button>
  );
}

function Opening({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <h1 className="font-display text-gradient-rose text-5xl leading-tight tracking-wider">It's Your Special Day 🌸</h1>
      <span className="h-px w-48 bg-rose-deep" />
      <div className="relative flex h-64 w-64 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-wine" />
        <span className="absolute inset-6 rounded-full border border-primary/60 shadow-[var(--glow)]" />
        <img src={pandaSleep} alt="Sleepy panda" className="animate-float relative w-40" />
      </div>
      <p className="font-script text-xl italic text-rose">I made something special for you...</p>
      <button onClick={onStart} className="btn-glow px-16 py-4 text-lg">START •ᴗ•</button>
    </div>
  );
}

function diff(from: Date) {
  const now = new Date();
  let y = now.getFullYear() - from.getFullYear();
  let m = now.getMonth() - from.getMonth();
  let d = now.getDate() - from.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { y, m, d };
}

function useCount(target: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 2200);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function Num({ n, label }: { n: number; label: string }) {
  const v = useCount(n);
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-display text-gradient-rose text-6xl">{v}</span>
      <span className="font-display text-sm tracking-[0.3em] text-rose-deep/80">{label}</span>
    </div>
  );
}

function Counter({ onNext }: { onNext: () => void }) {
  const { y, m, d } = diff(BIRTH_DATE);
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex h-40 w-40 items-center justify-center rounded-full border border-primary/40 bg-primary/10 shadow-[var(--glow)]">
        <img src={pandaHappy} alt="Happy panda" className="animate-float w-28" />
      </div>
      <h1 className="font-display text-gradient-rose text-4xl leading-tight">Happy Birthday My Girl 🎀</h1>
      <p className="font-script text-xl italic text-rose/80">You have completed</p>
      <div className="grid grid-cols-2 gap-x-16 gap-y-5">
        <Num n={y} label="YEARS" />
        <Num n={m} label="MONTHS" />
        <div className="col-span-2"><Num n={d} label="DAYS" /></div>
      </div>
      <button onClick={onNext} className="btn-glow px-16 py-4 text-lg">NEXT ➳</button>
    </div>
  );
}

function Memories({ onNext }: { onNext: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      const el = ref.current; if (!el) return;
      const next = (active + 1) % MEMORIES.length;
      el.scrollTo({ left: (el.children[next] as HTMLElement).offsetLeft - 20, behavior: "smooth" });
    }, 3500);
    return () => clearInterval(id);
  }, [active]);
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    setActive(Math.round(el.scrollLeft / (el.clientWidth * 0.82)));
  };
  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <h1 className="font-display text-gradient-rose text-4xl">Special Memories</h1>
      <span className="h-px w-48 bg-rose-deep" />
      <p className="font-script text-lg italic text-rose/80">Swipe for more ✦</p>
      <div ref={ref} onScroll={onScroll} className="-mx-5 flex w-[calc(100%+2.5rem)] snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none]">
        {MEMORIES.map((src, i) => (
          <img key={i} src={src} alt={`Memory ${i + 1}`} className={`aspect-[3/4] w-[82%] shrink-0 snap-center rounded-3xl object-cover shadow-[var(--glow)] transition-all duration-500 ${i === active ? "scale-100 opacity-100" : "scale-90 opacity-60"}`} />
        ))}
      </div>
      <div className="flex gap-2">
        {MEMORIES.map((_, i) => <span key={i} className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-primary" : "w-2 bg-wine"}`} />)}
      </div>
      <button onClick={onNext} className="btn-glow px-14 py-4 text-lg">✎ MESSAGE</button>
    </div>
  );
}

function Loading({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-wine border-t-primary" style={{ animation: "spin-slow 1.2s linear infinite" }} />
        <span className="absolute inset-0 rounded-full border border-primary" style={{ animation: "pulse-ring 1.6s ease-out infinite" }} />
        <Heart className="h-10 w-10 animate-pulse fill-primary text-primary" />
      </div>
      <p className="font-script text-xl italic text-rose">Preparing something from my heart...</p>
    </div>
  );
}

function Letter({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex w-full flex-col items-center gap-6 text-center">
      <h1 className="font-caps text-gradient-rose text-3xl">A Letter, Just For You</h1>
      <p className="font-script text-lg italic text-rose/80">Tap the heart to unseal your message...</p>
      <button onClick={onOpen} className="glass-card relative mt-4 flex h-72 w-full flex-col items-center justify-center gap-4 overflow-hidden">
        <span className="absolute h-44 w-64 rotate-[-12deg] rounded-3xl border-[14px] border-wine/70" />
        <span className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-primary bg-primary/30 shadow-[var(--glow)]">
          <span className="absolute inset-0 rounded-full border border-primary" style={{ animation: "pulse-ring 1.8s ease-out infinite" }} />
          <Heart className="h-12 w-12 text-rose-deep" />
        </span>
        <span className="font-caps relative tracking-[0.3em]">TAP TO OPEN</span>
      </button>
      <div className="flex items-center gap-4"><span className="h-px w-28 bg-wine" /><Heart className="h-4 w-4 fill-primary text-primary" /><span className="h-px w-28 bg-wine" /></div>
    </div>
  );
}

function Message({ onRestart }: { onRestart: () => void }) {
  const [shown, setShown] = useState("");
  const [party, setParty] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chars = Array.from(MESSAGE); let i = 0;
    const id = setInterval(() => {
      i++; setShown(chars.slice(0, i).join(""));
      if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
      if (i >= chars.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      {party > 0 && <Petals key={party} />}
      <div className="glass-card relative w-full p-6">
        <button onClick={onRestart} aria-label="Close" className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-primary bg-wine"><X className="h-5 w-5" /></button>
        <h1 className="font-caps text-gradient-rose mt-2 text-center text-2xl">Just For You ✨</h1>
        <p className="font-script mb-5 text-center italic text-rose-deep">From my heart to yours</p>
        <div ref={boxRef} className="font-script h-80 overflow-y-auto whitespace-pre-wrap rounded-3xl border border-wine bg-background p-5 text-xl leading-relaxed">
          {shown}<span className="animate-pulse text-primary">|</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button onClick={() => setParty((p) => p + 1)} className="font-caps rounded-full border border-primary bg-gradient-to-b from-primary to-wine py-3 font-bold tracking-widest shadow-[var(--glow)]">Celebrate</button>
          <button onClick={onRestart} className="font-caps flex items-center justify-center gap-2 rounded-full border border-primary bg-wine/50 py-3 font-bold tracking-widest text-rose-deep">Restart <RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>
    </>
  );
}

function Petals() {
  const items = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    l: Math.random() * 100, dl: Math.random() * 2, du: 3 + Math.random() * 3,
    e: i % 4 === 0 ? ["🌹", "🌸", "🌺", "💐", "❤️"][i % 5] : "", s: 6 + Math.random() * 10,
  })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {items.map((p, i) => (
        <span key={i} className={`absolute top-0 ${p.e ? "text-2xl" : "rounded-sm bg-primary"}`}
          style={{ left: `${p.l}%`, width: p.e ? undefined : p.s, height: p.e ? undefined : p.s * 0.6, animation: `fall ${p.du}s linear ${p.dl}s both` }}>{p.e}</span>
      ))}
    </div>
  );
}
