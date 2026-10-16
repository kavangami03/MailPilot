import { useEffect, useRef, useState } from "react";
import { CalendarClock, Check, Pause, Play, Send, Sparkles } from "lucide-react";
import { gsap, prefersReducedMotion, ScrollTrigger, typeInto, useGSAP } from "../lib/motion";
import { DEMO_LENGTH, demoChapters, drafts, incomingEmail, links } from "../data/content";
import { Avatar, BtnArrow, Scribble } from "./ui";
import "./Demo.css";

const REPLY = drafts.executive.text;
const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;

const rows = [
  { id: "jon", name: "Jon Bell", initials: "JB", tone: "bronze" as const, subject: "Proposal: any thoughts?", time: "Mon" },
  { id: "priya", name: "Priya Shah", initials: "PS", tone: "teal" as const, subject: "Renewal kickoff", time: "Tue" },
  { id: "fin", name: "Finance", initials: "FI", tone: "dark" as const, subject: "Invoice #2291", time: "Tue" },
  { id: "lena", name: "Lena Okafor", initials: "LO", tone: "teal" as const, subject: "Quarterly review deck", time: "Wed" },
];

export function Demo() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  // Keep the cursor's coordinate space in sync with the stage size.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      el.style.setProperty("--sw", `${el.clientWidth}px`);
      el.style.setProperty("--sh", `${el.clientHeight}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const typed = q(".dm__typed")[0] as HTMLElement;
      const fill = q(".dm__progress-fill")[0] as HTMLElement;
      const timeEl = q(".dm__time-now")[0] as HTMLElement;
      const chapters = q(".dm__chapter") as HTMLElement[];
      let active = -1;

      const markChapter = (t: number) => {
        let idx = 0;
        demoChapters.forEach((c, i) => t >= c.t && (idx = i));
        if (idx !== active) {
          chapters.forEach((c, i) => c.classList.toggle("is-active", i === idx));
          active = idx;
        }
        const start = demoChapters[idx].t;
        const end = demoChapters[idx + 1]?.t ?? DEMO_LENGTH;
        chapters[idx]?.style.setProperty("--p", String(Math.min(1, (t - start) / (end - start))));
      };

      if (prefersReducedMotion()) {
        typed.textContent = REPLY;
        root.current!.classList.add("is-static");
        markChapter(DEMO_LENGTH - 1);
        return;
      }

      const tl = gsap.timeline({
        paused: true,
        repeat: -1,
        defaults: { ease: "power3.out", duration: 0.6 },
        onUpdate: () => {
          const t = tl.time();
          fill.style.transform = `scaleX(${t / DEMO_LENGTH})`;
          timeEl.textContent = fmt(t);
          markChapter(t);
        },
      });
      tlRef.current = tl;

      // ---- initial state (re-applied every loop) ----
      tl.set(q(".dm__row--new"), { height: 0, autoAlpha: 0 }, 0)
        .set(q(".dm__row--new"), { backgroundColor: "rgba(243,234,221,0)" }, 0)
        .set(q(".dm__thread, .dm__persona, .dm__compose, .dm__toast, .dm__asks .chip, .dm__answered"), { autoAlpha: 0 }, 0)
        .set(q(".dm__empty"), { autoAlpha: 1 }, 0)
        .set(q(".dm__reading"), { autoAlpha: 0, scaleX: 0 }, 0)
        .set(q(".dm__trait i"), { scaleX: 0 }, 0)
        .set(q(".dm__tag--follow, .dm__tag--sent"), { autoAlpha: 0, scale: 0.6 }, 0)
        .set(q(".dm__send"), { scale: 1 }, 0)
        .set(root.current!, { "--cx": 0.72, "--cy": 0.82 }, 0)
        .call(() => (typed.textContent = ""), [], 0.05);

      // 0–4 · a new email lands
      tl.to(q(".dm__row--new"), { height: "auto", autoAlpha: 1, duration: 0.7 }, 0.6)
        .to(q(".dm__row--new"), { backgroundColor: "rgba(243,234,221,1)", duration: 0.4 }, 1.2)
        .to(root.current!, { "--cx": 0.17, "--cy": 0.2, duration: 1.4, ease: "power2.inOut" }, 1.6)
        .to(q(".dm__cursor"), { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1 }, 3.1)
        .to(q(".dm__row--new"), { backgroundColor: "rgba(226,237,234,1)", duration: 0.3 }, 3.2)
        // 4–8 · MailPilot reads the thread
        .to(q(".dm__empty"), { autoAlpha: 0, duration: 0.3 }, 4)
        .fromTo(q(".dm__thread"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0 }, 4.1)
        .to(q(".dm__reading"), { autoAlpha: 1, scaleX: 1, duration: 1.4, ease: "power1.inOut" }, 4.6)
        .fromTo(q(".dm__asks .chip"), { autoAlpha: 0, y: 8, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.5, ease: "back.out(2)" }, 5.4)
        .to(q(".dm__reading"), { autoAlpha: 0, duration: 0.3 }, 7.2)
        .to(root.current!, { "--cx": 0.8, "--cy": 0.5, duration: 1.2, ease: "power2.inOut" }, 6.8)
        // 8–12 · Persona kicks in
        .fromTo(q(".dm__persona"), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.7 }, 8)
        .to(q(".dm__trait i"), { scaleX: (i: number) => [0.86, 0.48, 0.72][i] ?? 0.6, stagger: 0.18, duration: 0.9, ease: "power2.out" }, 8.4)
        .to(q(".dm__persona"), { autoAlpha: 0, x: 30, duration: 0.4 }, 11.6)
        // 12–16 · the reply is drafted
        .fromTo(q(".dm__compose"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0 }, 12)
        .add(typeInto(typed, REPLY, 3.2), 12.4)
        .fromTo(q(".dm__answered"), { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0 }, 15.7)
        // 16–20 · follow-up scheduled
        .fromTo(q(".dm__toast--follow"), { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, ease: "back.out(1.6)" }, 16.1)
        .to(q(".dm__tag--follow"), { autoAlpha: 1, scale: 1, ease: "back.out(2)" }, 16.6)
        .to(q(".dm__toast--follow"), { autoAlpha: 0, y: -10, duration: 0.4 }, 19.4)
        // 20–24 · you review, you send
        .to(root.current!, { "--cx": 0.86, "--cy": 0.86, duration: 1.1, ease: "power2.inOut" }, 19.6)
        .to(q(".dm__cursor"), { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1 }, 20.9)
        .to(q(".dm__send"), { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1 }, 20.9)
        .fromTo(q(".dm__toast--sent"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, ease: "back.out(1.6)" }, 21.2)
        .to(q(".dm__tag--sent"), { autoAlpha: 1, scale: 1, ease: "back.out(2)" }, 21.5)
        .to({}, { duration: 0.01 }, DEMO_LENGTH - 0.01);

      // Render the opening frame now (seek suppresses callbacks, so clear the draft by hand).
      typed.textContent = "";
      tl.seek(0.06);

      ScrollTrigger.create({
        trigger: q(".dm__player")[0],
        start: "top 85%",
        end: "bottom 15%",
        onToggle: (self) => {
          if (self.isActive && !userPaused.current) {
            tl.play();
            setPlaying(true);
          } else {
            tl.pause();
            setPlaying(false);
          }
        },
      });
      markChapter(0);
    },
    { scope: root },
  );

  const toggle = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (tl.paused()) {
      userPaused.current = false;
      tl.play();
      setPlaying(true);
    } else {
      userPaused.current = true;
      tl.pause();
      setPlaying(false);
    }
  };

  const seek = (t: number) => {
    const tl = tlRef.current;
    if (!tl) return;
    userPaused.current = false;
    tl.seek(t).play();
    setPlaying(true);
  };

  const onTrack = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - r.left) / r.width) * DEMO_LENGTH);
  };

  return (
    <section className="demo panel-wrap" id="demo" ref={root}>
      <div className="panel panel--white demo__panel">
        <div className="shell demo__grid">
          <div className="demo__copy">
            <p className="eyebrow">Watch it work</p>
            <h2 className="h2" data-split>
              See MailPilot handle an email in{" "}
              <span className="ipill">
                <Play fill="currentColor" />
              </span>{" "}
              <span className="scribble-wrap">
                <span className="script">20 seconds.</span>
                <Scribble />
              </span>
            </h2>
            <p className="lead" data-reveal>
              One email in, one reply out, in your voice. Then a follow-up, scheduled. You stay in control the whole way.
            </p>

            <ol className="demo__chapters" data-reveal="stagger">
              {demoChapters.map((c) => (
                <li key={c.t}>
                  <button className="dm__chapter" onClick={() => seek(c.t + 0.01)}>
                    <time>{fmt(c.t)}</time>
                    <span>
                      <strong>{c.label}</strong>
                      <em>{c.sub}</em>
                    </span>
                    <i className="dm__chapter-bar" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>

            <a className="btn btn--bronze btn--arrow demo__cta" href={links.signup} data-reveal>
              Try it on your inbox <BtnArrow />
            </a>
          </div>

          <div className="dm__player" data-reveal>
            <div className="dm__screen">
              <div className="dm__chrome">
                <span className="dm__lights">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="dm__title">MailPilot · Priority inbox</span>
                <span className="chip chip--bronze">Sample scenario</span>
              </div>

              <div className="dm__stage" ref={stage}>
                <aside className="dm__list">
                  <header>
                    <strong>Priority inbox</strong>
                    <span className="chip">5</span>
                  </header>
                  <div className="dm__row dm__row--new">
                    <Avatar name="maya" initials="MC" />
                    <span className="dm__row-text">
                      <strong>{incomingEmail.from}</strong>
                      <span>Launch notes: review before Thu?</span>
                    </span>
                    <span className="dm__row-side">
                      <time>9:42</time>
                      <span className="dm__tag dm__tag--sent">Replied</span>
                    </span>
                  </div>
                  {rows.map((r) => (
                    <div className="dm__row" key={r.id}>
                      <Avatar name={r.id} initials={r.initials} tone={r.tone} />
                      <span className="dm__row-text">
                        <strong>{r.name}</strong>
                        <span>{r.subject}</span>
                      </span>
                      <span className="dm__row-side">
                        <time>{r.time}</time>
                        {r.id === "jon" && <span className="dm__tag dm__tag--follow">Follow-up Fri</span>}
                      </span>
                    </div>
                  ))}
                </aside>

                <section className="dm__pane">
                  <p className="dm__empty">Select an email to start</p>

                  <div className="dm__thread">
                    <p className="dm__subject">{incomingEmail.subject}</p>
                    <div className="dm__msg">
                      <Avatar name="maya" initials="MC" />
                      <p>
                        <strong>Maya Chen</strong> {incomingEmail.body}
                      </p>
                    </div>
                    <div className="dm__reading">
                      <Sparkles size={12} /> MailPilot is reading the thread…
                    </div>
                    <div className="dm__asks">
                      <span className="chip">
                        <Check size={11} /> Review copy by Thursday
                      </span>
                      <span className="chip">
                        <Check size={11} /> Partner call: still on?
                      </span>
                      <span className="chip">
                        <Check size={11} /> Who owns pricing slide
                      </span>
                    </div>
                  </div>

                  <div className="dm__compose">
                    <p className="dm__compose-head">
                      <Sparkles size={12} /> Drafted in your voice
                    </p>
                    <p className="dm__compose-text">
                      <span className="dm__typed" />
                      <span className="caret" />
                    </p>
                    <div className="dm__compose-foot">
                      <span className="dm__answered">
                        <Check size={12} /> 3/3 questions answered
                      </span>
                      <span className="dm__send">
                        <Send size={12} /> Approve &amp; send
                      </span>
                    </div>
                  </div>
                </section>

                <div className="dm__persona">
                  <p className="dm__persona-head">
                    <span>Persona</span>
                    <strong>Executive</strong>
                    <b>96%</b>
                  </p>
                  {[
                    ["Formality", "86"],
                    ["Warmth", "48"],
                    ["Brevity", "72"],
                  ].map(([k, v]) => (
                    <p className="dm__trait" key={k}>
                      <span>{k}</span>
                      <em>
                        <i />
                      </em>
                      <b>{v}</b>
                    </p>
                  ))}
                  <p className="dm__persona-voice">
                    “Hi Maya,” <span>…</span> “Best, Alex”
                  </p>
                </div>

                <div className="dm__toast dm__toast--follow">
                  <span className="dm__toast-icon">
                    <CalendarClock size={14} />
                  </span>
                  <span>
                    <strong>Follow-up scheduled · Jon Bell</strong>
                    <em>Fri 09:00 · stops the moment he replies</em>
                  </span>
                </div>
                <div className="dm__toast dm__toast--sent">
                  <span className="dm__toast-icon">
                    <Check size={14} />
                  </span>
                  <span>
                    <strong>Sent from alex@yourco.com</strong>
                    <em>From your own address, as you</em>
                  </span>
                </div>

                <span className="dm__cursor-pos" aria-hidden="true">
                  <svg className="dm__cursor" viewBox="0 0 24 24">
                    <path d="M4 2.5 19 12l-6.6 1.4L9 20.2Z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="dm__bar">
              <button className="dm__play" onClick={toggle} aria-label={playing ? "Pause demo" : "Play demo"}>
                {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              </button>
              <div className="dm__track" onClick={onTrack} role="presentation">
                <span className="dm__progress">
                  <span className="dm__progress-fill" />
                </span>
                {demoChapters.slice(1).map((c) => (
                  <i key={c.t} style={{ left: `${(c.t / DEMO_LENGTH) * 100}%` }} />
                ))}
              </div>
              <span className="dm__time">
                <span className="dm__time-now">0:00</span> / {fmt(DEMO_LENGTH)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
