import { useCallback, useEffect, useRef, useState } from "react";
import { AtSign, Check, Inbox, Lock, PauseCircle, RefreshCw, Send } from "lucide-react";
import { gsap, prefersReducedMotion } from "../lib/motion";
import { Avatar, Photo, Scribble } from "./ui";
import "./Control.css";

type Mode = "draft" | "semi";
type By = "you" | "auto";

const queue = [
  {
    id: "maya",
    initials: "MC",
    tone: "teal" as const,
    to: "Maya Chen",
    kind: "Reply",
    subject: "Re: Launch notes",
    body: "Hi Maya, edits back by Thursday at 2pm, priority items first. The partner call stands, and Jon owns the pricing slide; I've copied him.",
  },
  {
    id: "jon",
    initials: "JB",
    tone: "bronze" as const,
    to: "Jon Bell",
    kind: "Follow-up",
    subject: "Proposal: next step",
    body: "Hi Jon, circling back on the proposal. Would a 20-minute call on Thursday help us agree the next step?",
  },
  {
    id: "priya",
    initials: "PS",
    tone: "dark" as const,
    to: "Priya Shah",
    kind: "Reply",
    subject: "Re: Renewal kickoff",
    body: "Hi Priya, Monday works well for the kickoff. I'll bring last quarter's numbers so we can plan the year properly.",
  },
  {
    id: "lena",
    initials: "LK",
    tone: "teal" as const,
    to: "Lena Koch",
    kind: "Follow-up",
    subject: "Quick check-in",
    body: "Hi Lena, just checking the samples arrived safely. Happy to walk your team through them whenever suits.",
  },
];

const modes: Record<Mode, { label: string; text: string }> = {
  draft: {
    label: "Draft mode",
    text: "Every email waits for your seal. Nothing sends until you approve it.",
  },
  semi: {
    label: "Semi-automatic",
    text: "Follow-ups seal themselves. Replies still wait for you.",
  },
};

const trust = [
  {
    icon: AtSign,
    title: "Sent from your address",
    text: "Never a bot account.",
  },
  { icon: Lock, title: "User-scoped data", text: "Isolated to your account." },
  {
    icon: RefreshCw,
    title: "Two-way sync",
    text: "Gmail and Outlook stay in step.",
  },
  {
    icon: PauseCircle,
    title: "Pause anything",
    text: "Per contact or per thread.",
  },
];

type Sent = { key: number; to: string; kind: string; by: By; time: string };

export function Control() {
  const [mode, setMode] = useState<Mode>("draft");
  const [idx, setIdx] = useState(0);
  const [sealed, setSealed] = useState<false | By>(false);
  const [sent, setSent] = useState<Sent[]>([]);
  const busy = useRef(false);
  const minute = useRef(2);
  const tool = useRef<HTMLButtonElement>(null);
  const target = useRef<HTMLSpanElement>(null);
  const letter = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, y: 0, ox: 0, oy: 0, on: false });
  const draft = queue[idx];
  const waiting = [1, 2, 3].map((k) => queue[(idx + k) % queue.length]);

  // Letter goes to the outbox, the next one comes off the in-tray
  const post = useCallback(
    (by: By) => {
      const d = queue[idx];
      const done = () => {
        minute.current += 3 + Math.round(Math.random() * 4);
        const time = `9:${String(minute.current % 60).padStart(2, "0")}`;
        setSent((s) => [{ key: Date.now(), to: d.to, kind: d.kind, by, time }, ...s].slice(0, 3));
        setSealed(false);
        setIdx((i) => (i + 1) % queue.length);
        busy.current = false;
      };
      const el = letter.current;
      if (!el || prefersReducedMotion()) return done();
      gsap
        .timeline()
        .to(el, {
          x: "55%",
          y: -30,
          rotate: 6,
          scale: 0.55,
          autoAlpha: 0,
          duration: 0.65,
          ease: "power3.in",
        })
        .add(done)
        .fromTo(
          el,
          { x: "-55%", y: 10, rotate: -5, scale: 0.6, autoAlpha: 0 },
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "expo.out",
          },
          "+=0.05",
        );
    },
    [idx],
  );

  // The stamp travels to the letter, presses, and the wax appears
  const press = useCallback(
    (by: By) => {
      if (busy.current) return;
      busy.current = true;
      const t = tool.current;
      const g = target.current;
      if (!t || !g || prefersReducedMotion()) {
        setSealed(by);
        window.setTimeout(() => post(by), 900);
        return;
      }
      const b = g.getBoundingClientRect();
      const base = t.querySelector(".stamp__base")!.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (base.left + base.width / 2);
      const dy = b.top + b.height / 2 - (base.top + base.height / 2);
      const x0 = Number(gsap.getProperty(t, "x"));
      const y0 = Number(gsap.getProperty(t, "y"));
      gsap
        .timeline()
        .to(t, {
          x: x0 + dx,
          y: y0 + dy - 26,
          rotate: 0,
          duration: 0.5,
          ease: "power2.inOut",
        })
        .to(t, { y: y0 + dy, scaleY: 0.94, duration: 0.14, ease: "power3.in" })
        .add(() => {
          setSealed(by);
          gsap.fromTo(letter.current, { y: 0 }, { y: 5, duration: 0.08, yoyo: true, repeat: 1 });
        })
        .to(t, { y: y0 + dy - 40, scaleY: 1, duration: 0.3, ease: "power2.out" }, "+=0.12")
        .to(t, { x: 0, y: 0, duration: 0.7, ease: "power3.inOut" })
        .add(() => post(by), "+=0.15");
    },
    [post],
  );

  // Semi-automatic: follow-ups seal themselves
  useEffect(() => {
    if (mode === "semi" && draft.kind === "Follow-up" && !sealed && !busy.current) {
      const id = window.setTimeout(() => press("auto"), 900);
      return () => window.clearTimeout(id);
    }
  }, [mode, draft.kind, sealed, press, idx]);

  const onDown = (e: React.PointerEvent) => {
    if (busy.current || sealed) return;
    const t = tool.current!;
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      ox: Number(gsap.getProperty(t, "x")),
      oy: Number(gsap.getProperty(t, "y")),
      on: true,
    };
    t.setPointerCapture(e.pointerId);
    t.classList.add("is-dragging");
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.on || !tool.current) return;
    gsap.set(tool.current, {
      x: d.ox + e.clientX - d.x,
      y: d.oy + e.clientY - d.y,
      rotate: gsap.utils.clamp(-14, 14, (e.clientX - d.x) * 0.05),
    });
  };
  const onUp = () => {
    const t = tool.current;
    if (!drag.current.on || !t || !target.current) return;
    drag.current.on = false;
    t.classList.remove("is-dragging");
    const a = t.querySelector(".stamp__base")!.getBoundingClientRect();
    const b = target.current.getBoundingClientRect();
    const pad = 40;
    const hit = a.left < b.right + pad && a.right > b.left - pad && a.top < b.bottom + pad && a.bottom > b.top - pad;
    if (hit) press("you");
    else
      gsap.to(t, {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.7,
        ease: "back.out(1.5)",
      });
  };

  return (
    <section className="control panel-wrap" id="control">
      <div className="panel panel--dark grain ctl">
        <div className="shell">
          <header className="ctl__head">
            <p className="eyebrow">You're in control</p>
            <h2 className="h2" data-split>
              Nothing leaves{" "}
              <span className="scribble-wrap">
                <span className="script">without your seal.</span>
                <Scribble />
              </span>
            </h2>
            <p className="lead" data-reveal>
              MailPilot prepares everything. You decide what goes out. Try it: pick up the seal and press it on the
              letter.
            </p>
          </header>

          <div className="ctl__stage" data-reveal>
            {/* In-tray */}
            <aside className="tray tray--in" aria-label="Drafts waiting for you">
              <p className="tray__label">
                <Inbox size={15} /> Waiting for your seal
              </p>
              <div className="tray__stack">
                {waiting.map((w, i) => (
                  <div className="mini" key={`${w.id}-${idx}`} style={{ ["--k" as string]: i }}>
                    <span className={`mini__kind ${w.kind === "Follow-up" ? "is-follow" : ""}`}>{w.kind}</span>
                    <strong>To {w.to}</strong>
                    <em>{w.subject}</em>
                    <i />
                    <i />
                  </div>
                ))}
              </div>
              <p className="tray__count">
                <b>{queue.length - 1}</b> more in your queue
              </p>
            </aside>

            {/* The desk mat with the current letter and the seal */}
            <div className="mat">
              <div className="ltr-pile">
                <div className="ltr" ref={letter} aria-live="polite">
                  <div className="ltr__head">
                    <Avatar name={draft.id} initials={draft.initials} tone={draft.tone} />
                    <span>
                      <strong>To {draft.to}</strong>
                      <em>{draft.subject}</em>
                    </span>
                    <span className={`ltr__kind ${draft.kind === "Follow-up" ? "is-follow" : ""}`}>{draft.kind}</span>
                  </div>
                  <p className="ltr__body">{draft.body}</p>
                  <p className="ltr__sign">Best, Alex</p>
                  <span className={`ltr__target ${sealed ? "is-sealed" : ""}`} ref={target}>
                    {sealed ? (
                      <span className="wax3">
                        <img src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
                      </span>
                    ) : (
                      <em>seal here</em>
                    )}
                  </span>
                  <p className={`ltr__status ${sealed ? "is-on" : ""}`}>
                    <Check size={14} />
                    {sealed === "auto"
                      ? "Sealed automatically · semi-auto follow-up"
                      : "Approved · sending from alex@yourco.com"}
                  </p>
                </div>
              </div>

              <div className="mat__tool">
                <button
                  className="stamp"
                  ref={tool}
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                  onClick={(e) => e.detail === 0 && press("you")}
                  disabled={!!sealed}
                  aria-label="Approve this draft with your seal"
                >
                  <svg viewBox="0 0 120 196" aria-hidden="true">
                    <defs>
                      <linearGradient id="stWood" x1="0" x2="1">
                        <stop offset="0" stopColor="#2a160a" />
                        <stop offset="0.18" stopColor="#5a321a" />
                        <stop offset="0.38" stopColor="#a8703f" />
                        <stop offset="0.5" stopColor="#8a5530" />
                        <stop offset="0.78" stopColor="#4d2a14" />
                        <stop offset="1" stopColor="#24130a" />
                      </linearGradient>
                      <linearGradient id="stBrass" x1="0" x2="1">
                        <stop offset="0" stopColor="#4a3420" />
                        <stop offset="0.16" stopColor="#8a6a49" />
                        <stop offset="0.34" stopColor="#f6dfb6" />
                        <stop offset="0.46" stopColor="#d9b384" />
                        <stop offset="0.7" stopColor="#9a7650" />
                        <stop offset="1" stopColor="#3f2c19" />
                      </linearGradient>
                      <linearGradient id="stCap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#f3d9ae" />
                        <stop offset="1" stopColor="#a8845d" />
                      </linearGradient>
                      <radialGradient id="stShine" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                      </radialGradient>
                      <filter id="stBlur" x="-50%" y="-200%" width="200%" height="500%">
                        <feGaussianBlur stdDeviation="3.5" />
                      </filter>
                    </defs>
                    {/* contact shadow */}
                    <ellipse
                      className="stamp__shadow"
                      cx="60"
                      cy="184"
                      rx="36"
                      ry="6"
                      fill="#000"
                      opacity="0.45"
                      filter="url(#stBlur)"
                    />
                    {/* turned wooden handle */}
                    <path
                      d="M60 4C66.5 4 71 8.5 71 14.5C71 19.5 67.5 23.5 63.5 25C65 27.5 67.5 29.5 71 31.5C80.5 37.5 85 49 84 61C83 75 74 85 68 95C65.5 100.5 64.5 107 65.5 113C66.5 119 70 123 75 127H45C50 123 53.5 119 54.5 113C55.5 107 54.5 100.5 52 95C46 85 37 75 36 61C35 49 39.5 37.5 49 31.5C52.5 29.5 55 27.5 56.5 25C52.5 23.5 49 19.5 49 14.5C49 8.5 53.5 4 60 4Z"
                      fill="url(#stWood)"
                    />
                    {/* wood grain + turning rings */}
                    <g fill="none" stroke="#2a160a" strokeOpacity="0.35" strokeWidth="0.8">
                      <path d="M50 40C47 55 48 70 55 86" />
                      <path d="M70 42C73 56 72 70 66 84" />
                      <path d="M57 26.5H63" strokeWidth="1.4" />
                      <path d="M54 104H66" />
                    </g>
                    <path
                      d="M46 44C43 54 44 66 49 76"
                      fill="none"
                      stroke="#fff"
                      strokeOpacity="0.28"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <ellipse cx="55" cy="12" rx="4" ry="3" fill="url(#stShine)" />
                    {/* brass collar */}
                    <rect x="41" y="126" width="38" height="10" rx="2.5" fill="url(#stBrass)" />
                    <path d="M41 131H79" stroke="#3f2c19" strokeOpacity="0.45" strokeWidth="0.8" />
                    {/* brass die body */}
                    <path d="M37 140L32 172A28 6 0 0 0 88 172L83 140A23 4.5 0 0 1 37 140Z" fill="url(#stBrass)" />
                    <ellipse cx="60" cy="140" rx="23" ry="4.5" fill="url(#stCap)" />
                    <path
                      d="M35.6 151A25 5 0 0 0 84.4 151"
                      fill="none"
                      stroke="#3f2c19"
                      strokeOpacity="0.5"
                      strokeWidth="0.9"
                    />
                    <path
                      d="M33.4 165A27 5.5 0 0 0 86.6 165"
                      fill="none"
                      stroke="#fff"
                      strokeOpacity="0.35"
                      strokeWidth="0.9"
                    />
                    <path
                      d="M44 143L41 170"
                      stroke="#fff"
                      strokeOpacity="0.4"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <image href="/mailpilot-mark-light.png" x="51" y="152" width="18" height="14.4" opacity="0.75" />
                  </svg>
                  <span className="stamp__base" aria-hidden="true" />
                </button>
                <p className="mat__hint" aria-hidden="true">
                  pick me up
                  <svg viewBox="0 0 80 40">
                    <path d="M4 30 C 24 6, 54 4, 74 18 M64 10 L74 18 L62 22" />
                  </svg>
                </p>
              </div>
            </div>

            {/* Outbox */}
            <aside className="tray tray--out" aria-label="Sent">
              <p className="tray__label">
                <Send size={15} /> Out · alex@yourco.com
              </p>
              <ol className="outbox">
                {sent.length === 0 && (
                  <li className="outbox__empty">Nothing has left yet. It won't until you say so.</li>
                )}
                {sent.map((s) => (
                  <li key={s.key} className="outbox__item">
                    <span className="outbox__pm" aria-hidden="true">
                      {s.time}
                    </span>
                    <span>
                      <strong>To {s.to}</strong>
                      <em>{s.by === "auto" ? "Follow-up · sealed automatically" : `${s.kind} · sealed by you`}</em>
                    </span>
                  </li>
                ))}
              </ol>
              <figure className="tray__photo">
                <Photo name="seal-hand" alt="A hand pressing a wax seal onto an envelope" />
                <figcaption>the real thing, minus the wax</figcaption>
              </figure>
            </aside>
          </div>

          <div className="ctl__bar" data-reveal>
            <div className={`switch is-${mode}`} role="radiogroup" aria-label="Automation mode">
              <span className="switch__thumb" aria-hidden="true" />
              {(Object.keys(modes) as Mode[]).map((m) => (
                <button
                  key={m}
                  role="radio"
                  aria-checked={mode === m}
                  className={mode === m ? "is-on" : ""}
                  onClick={() => setMode(m)}
                >
                  {modes[m].label}
                </button>
              ))}
            </div>
            <p className="ctl__mode-text" key={mode}>
              {modes[mode].text}
            </p>
            <button className="btn btn--ghost btn--sm ctl__approve" onClick={() => press("you")} disabled={!!sealed}>
              <Check size={15} /> Approve with one click
            </button>
          </div>

          <ul className="ctl__trust" data-reveal="stagger">
            {trust.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span className="ctl__ico">
                  <Icon size={18} />
                </span>
                <span>
                  <strong>{title}</strong>
                  <em>{text}</em>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
