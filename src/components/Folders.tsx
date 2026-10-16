import { useEffect, useRef, useState } from "react";
import { Check, Clock3, LayoutDashboard, PenLine, StickyNote, Users } from "lucide-react";
import { features, type FeatureVisual } from "../data/content";
import { prefersReducedMotion } from "../lib/motion";
import { FeatureVisualCard } from "./FeatureVisuals";
import { Photo, Scribble } from "./ui";
import "./Folders.css";

const meta: Record<FeatureVisual, { tab: string; icon: typeof PenLine; inside: string[]; note: string; caption: string }> = {
  voice: {
    tab: "Your voice",
    icon: PenLine,
    inside: ["Persona built once, from your own emails", "Executive, warm or concise on demand", "Your greetings, sign-offs and phrases"],
    note: "Reads like I wrote it!",
    caption: "writing in my voice",
  },
  relationships: {
    tab: "Relationships",
    icon: Users,
    inside: ["A profile for every contact, automatically", "Scored on recency, frequency, response", "Alerts before anyone goes cold"],
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
    inside: ["Response time and reply rate", "Who's waiting on you, and for how long", "Relationship scores and trends"],
    note: "Inbox health: 92",
    caption: "the whole inbox at a glance",
  },
  instructions: {
    tab: "Instructions",
    icon: StickyNote,
    inside: ["Notes on any email or contact", "“Keep it short”, “always copy Jon”", "Followed in every draft for that thread"],
    note: "Under 80 words, please",
    caption: "my rules, every thread",
  },
};

const AUTO_MS = 7000;

export function Folders() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLElement>(null);
  const n = features.length;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !inView || prefersReducedMotion()) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, inView, n]);

  return (
    <section className="folders section" id="features" ref={root}>
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
          <p className="lead" data-reveal>
            Everything MailPilot does, filed where you'd expect it. Pull any folder from the drawer to see the real thing
            at work.
          </p>
        </header>

        <div data-reveal>
          <div
            className={`cabinet ${inView && !paused ? "is-running" : ""}`}
            style={{ ["--n" as string]: n }}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            <div className="cabinet__stack" role="tablist" aria-label="Features">
              {features.map((f, i) => {
                const depth = (i - active + n) % n;
                const m = meta[f.visual];
                const Icon = m.icon;
                const front = depth === 0;
                return (
                  <article
                    key={f.id}
                    className={`mf ${front ? "is-front" : ""}`}
                    style={{ ["--d" as string]: depth, ["--i" as string]: i, zIndex: n - depth }}
                  >
                    <button
                      className="mf__tab"
                      role="tab"
                      id={`ftab-${f.id}`}
                      aria-selected={front}
                      aria-controls={`fpanel-${f.id}`}
                      onClick={() => setActive(i)}
                    >
                      <span className="mf__tab-num">{f.n}</span>
                      <Icon size={15} />
                      {m.tab}
                      {front && <i className="mf__timer" key={`${active}-${paused}`} />}
                    </button>

                    <div className="mf__body" id={`fpanel-${f.id}`} role="tabpanel" aria-labelledby={`ftab-${f.id}`} aria-hidden={!front}>
                      {front && (
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
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
