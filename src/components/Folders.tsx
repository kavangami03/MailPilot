import { useEffect, useRef, useState } from "react";
import { Check, Clock3, LayoutDashboard, PenLine, StickyNote, Users } from "lucide-react";
import { features, type FeatureVisual } from "../data/content";
import { gsap, getLenis, prefersReducedMotion, ScrollTrigger, useGSAP } from "../lib/motion";
import { FeatureVisualCard } from "./FeatureVisuals";
import { Photo, Scribble } from "./ui";
import "./Folders.css";

const meta: Record<
  FeatureVisual,
  { tab: string; icon: typeof PenLine; inside: string[]; note: string; caption: string }
> = {
  voice: {
    tab: "Your voice",
    icon: PenLine,
    inside: [
      "Persona built once, from your own emails",
      "Executive, warm or concise on demand",
      "Your greetings, sign-offs and phrases",
    ],
    note: "Reads like I wrote it!",
    caption: "writing in my voice",
  },
  relationships: {
    tab: "Relationships",
    icon: Users,
    inside: [
      "A profile for every contact, automatically",
      "Scored on recency, frequency, response",
      "Alerts before anyone goes cold",
    ],
    note: "Call Dev before Friday",
    caption: "keeping clients close",
  },
  followups: {
    tab: "Follow-ups",
    icon: Clock3,
    inside: ["Drafted from the original thread", "Per-contact frequency limits", "Stops the moment they reply"],
    note: "Never chase again",
    caption: "always following up",
  },
  overview: {
    tab: "Overview",
    icon: LayoutDashboard,
    inside: [
      "Response time and reply rate",
      "Who's waiting on you, and for how long",
      "Relationship scores and trends",
    ],
    note: "Inbox health: 92",
    caption: "the whole inbox at a glance",
  },
  instructions: {
    tab: "Instructions",
    icon: StickyNote,
    inside: [
      "Notes on any email or contact",
      "“Keep it short”, “always copy Jon”",
      "Followed in every draft for that thread",
    ],
    note: "Under 80 words, please",
    caption: "my rules, every thread",
  },
};

const AUTO_MS = 5000;

export function Folders() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [scrollMode, setScrollMode] = useState(false);
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const n = features.length;

  // Desktop: the folder pins and scrolling opens the next tab, an equal stretch of scroll each.
  // Phones and short or reduced-motion screens: tap the tabs (plus the gentle auto-rotation below).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1061px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)", () => {
        const wrap = pin.current!;
        const cabinet = wrap.querySelector<HTMLElement>(".cabinet")!;
        setScrollMode(true);
        // shrink the folder just enough to fit shorter screens, so nothing is cut off while it's pinned
        const fit = () => {
          cabinet.style.scale = "";
          const s = Math.min(1, (window.innerHeight - 110) / cabinet.offsetHeight);
          cabinet.style.scale = String(s);
          wrap.style.height = `${cabinet.offsetHeight * s}px`;
        };
        fit();
        ScrollTrigger.addEventListener("refreshInit", fit);
        trigger.current = ScrollTrigger.create({
          trigger: wrap,
          start: () => `top ${Math.max(84, (window.innerHeight - wrap.offsetHeight) / 2 + 24)}px`,
          end: () => `+=${window.innerHeight * 0.55 * n}`,
          pin: true,
          onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
        });
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", fit);
          cabinet.style.scale = "";
          wrap.style.height = "";
          trigger.current = null;
          setScrollMode(false);
        };
      });
    },
    { scope: root },
  );

  // Tabs: with scroll control, glide to that folder's stretch; otherwise just open it.
  const open = (i: number) => {
    const t = trigger.current;
    if (!t) return setActive(i);
    const y = t.start + ((t.end - t.start) * (i + 0.5)) / n;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // the open folder moves on by itself every few seconds while the section is on screen (paused on hover)
  useEffect(() => {
    if (scrollMode || paused || !inView || prefersReducedMotion()) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, inView, n, scrollMode]);

  return (
    <section className={`folders section ${scrollMode ? "is-scroll" : ""}`} id="features" ref={root}>
      <div className="shell">
        <header className="section-head section-head--split">
          <div>
            <p className="eyebrow">Features</p>
            <h2 className="h2" data-split>
              Five folders.{" "}
              <span className="scribble-wrap">
                <span className="script">One calm inbox.</span>
                <Scribble />
              </span>
            </h2>
          </div>
          <div className="folders__intro" data-reveal>
            <p className="lead">
              Everything MailPilot does, filed where you'd expect it, with the real thing at work inside each folder.
            </p>
            <p className="folders__hint">
              <span className="folders__hint--scroll">keep scrolling to flip through the folders ↓</span>
              <span className="folders__hint--tap">pick any tab to pull out a folder</span>
            </p>
          </div>
        </header>

        <div className="cabinet-pin" ref={pin}>
          <div data-reveal>
            <div
              className="cabinet"
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <div className="cabinet__stack" role="tablist" aria-label="Features">
                {features.map((f, i) => {
                  const m = meta[f.visual];
                  const Icon = m.icon;
                  const front = i === active;
                  return (
                    <article
                      key={f.id}
                      className={`mf ${front ? "is-front" : ""}`}
                      style={{ ["--i" as string]: i, zIndex: front ? n + 1 : n - i }}
                    >
                      <button
                        className="mf__tab"
                        role="tab"
                        id={`ftab-${f.id}`}
                        aria-selected={front}
                        aria-controls={`fpanel-${f.id}`}
                        onClick={() => open(i)}
                      >
                        <span className="mf__tab-num">{f.n}</span>
                        <Icon size={15} />
                        {m.tab}
                      </button>

                      {/* every folder is filled, so the folder keeps one height whichever is open */}
                      <div
                        className="mf__body"
                        id={`fpanel-${f.id}`}
                        role="tabpanel"
                        aria-labelledby={`ftab-${f.id}`}
                        aria-hidden={!front}
                        inert={!front}
                      >
                        <div className="mf__content">
                          <div className="mf__copy">
                            <p className="mf__kicker">
                              <span>Folder {f.n}</span> / 0{n}
                            </p>
                            <h3>{f.title}</h3>
                            <p className="mf__text">{f.text}</p>
                            <p className="mf__inside-label">inside this folder:</p>
                            <ul className="mf__inside">
                              {m.inside.map((t) => (
                                <li key={t}>
                                  <Check size={15} /> {t}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mf__desk">
                            <figure className="polaroid">
                              <span className="polaroid__tape" />
                              <div className="polaroid__img">
                                <Photo name={f.photo} alt={f.alt}>
                                  <Icon size={64} strokeWidth={1.2} />
                                </Photo>
                              </div>
                              <figcaption>{m.caption}</figcaption>
                            </figure>
                            <div className="mf__card">
                              <svg className="clip" viewBox="0 0 24 64" aria-hidden="true">
                                <path d="M7 44 V12 a5 5 0 0 1 10 0 V50 a8 8 0 0 1 -16 0 V18" />
                              </svg>
                              <FeatureVisualCard kind={f.visual} />
                            </div>
                            <p className="sticky">{m.note}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
