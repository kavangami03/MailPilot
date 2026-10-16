import { useEffect, useRef, useState } from "react";
import { CalendarClock, Check, Inbox, Pin, Send, Snowflake, Sparkles } from "lucide-react";
import { steps } from "../data/content";
import { Avatar, PlatformIcon, Scribble } from "./ui";
import "./Steps.css";

function ScenePersona() {
  return (
    <div className="sc__card">
      <p className="sc__label">Your Persona</p>
      <div className="sc__field">
        <span>Describe how you write</span>
        <p>Direct and warm. Short paragraphs. I open with “Hi {"{first}"},” and sign off “Best, Alex”.</p>
      </div>
      <div className="sc__row sc__chips" style={{ ["--i" as string]: 1 }}>
        <span className="chip chip--bronze">+ 3 sample emails</span>
        <span className="chip">Executive</span>
        <span className="chip">Warm</span>
      </div>
      {[
        ["Formality", 86],
        ["Warmth", 48],
        ["Brevity", 72],
      ].map(([k, v], i) => (
        <p className="sc__row sc__trait" key={k} style={{ ["--i" as string]: i + 2, ["--v" as string]: Number(v) / 100 }}>
          <span>{k}</span>
          <em>
            <i />
          </em>
          <b>{v}</b>
        </p>
      ))}
      <p className="sc__row sc__ok" style={{ ["--i" as string]: 5 }}>
        <Check size={14} /> Persona saved
      </p>
    </div>
  );
}

function SceneConnect() {
  return (
    <div className="sc__card">
      <p className="sc__label">Connect your inbox</p>
      <div className="sc__row sc__provider is-on" style={{ ["--i" as string]: 0 }}>
        <span className="sc__logo">
          <PlatformIcon name="Gmail" size={20} />
        </span>
        <span>
          <strong>Gmail</strong>
          <em>alex@yourco.com</em>
        </span>
        <span className="chip">
          <Check size={12} /> Connected
        </span>
      </div>
      <div className="sc__row sc__provider" style={{ ["--i" as string]: 1 }}>
        <span className="sc__logo">
          <PlatformIcon name="Outlook" size={20} />
        </span>
        <span>
          <strong>Outlook</strong>
          <em>Office 365 · Outlook.com</em>
        </span>
        <span className="chip chip--ghost">Connect</span>
      </div>
      <div className="sc__row sc__sync" style={{ ["--i" as string]: 2 }}>
        <p>
          <Sparkles size={13} /> Reading your history…
        </p>
        <em>
          <i />
        </em>
        <span>4,218 threads · 142 relationship profiles</span>
      </div>
    </div>
  );
}

const feed = [
  { icon: Send, tone: "teal", what: "Drafted a reply", who: "Maya Chen", when: "9:43" },
  { icon: CalendarClock, tone: "bronze", what: "Scheduled a follow-up", who: "Jon Bell · Fri 09:00", when: "9:44" },
  { icon: Snowflake, tone: "alert", what: "Flagged as cooling", who: "Dev Raman · 26 days", when: "9:44" },
  { icon: Pin, tone: "dark", what: "Pinned for you", who: "Board deck · needs you", when: "9:45" },
];

function SceneManage() {
  return (
    <div className="sc__card">
      <p className="sc__label">
        <span className="dot dot--live" /> Working in the background
      </p>
      <ul className="sc__feed">
        {feed.map(({ icon: Icon, tone, what, who, when }, i) => (
          <li className="sc__row" key={what} style={{ ["--i" as string]: i }}>
            <span className={`sc__icon sc__icon--${tone}`}>
              <Icon size={14} />
            </span>
            <span>
              <strong>{what}</strong>
              <em>{who}</em>
            </span>
            <time>{when}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SceneReview() {
  return (
    <div className="sc__card">
      <p className="sc__label">Review &amp; send</p>
      <div className="sc__row sc__draft" style={{ ["--i" as string]: 0 }}>
        <div className="sc__draft-head">
          <Avatar name="maya" initials="MC" />
          <span>
            <strong>Reply to Maya Chen</strong>
            <em>Drafted in your voice · 96% match</em>
          </span>
        </div>
        <p>Hi Maya, edits back by Thursday 2pm. The partner call stands, and Jon owns pricing (cc'd). Best, Alex</p>
        <div className="sc__actions">
          <span className="chip chip--ghost">Edit</span>
          <span className="sc__approve">
            <Send size={12} /> Approve &amp; send
          </span>
        </div>
      </div>
      <p className="sc__row sc__sent" style={{ ["--i" as string]: 1 }}>
        <Check size={14} /> Sent from alex@yourco.com
      </p>
    </div>
  );
}

const scenes = [ScenePersona, SceneConnect, SceneManage, SceneReview];

export function Steps() {
  const [active, setActive] = useState(0);
  const [swipe, setSwipe] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>(".steps__item") ?? []);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="steps section" id="how">
      <div className="shell">
        <header className="section-head section-head--center">
          <p className="eyebrow">How it works</p>
          <h2 className="h2" data-split>
            Four steps.{" "}
            <span className="script-line">
              <span className="scribble-wrap">
                <span className="script">Under twenty minutes.</span>
                <Scribble />
              </span>
            </span>
          </h2>
          <p className="lead" data-reveal>
            From sign-up to your first drafted reply in a single sitting. Nothing to install, nothing to migrate.
          </p>
        </header>

        <div className="steps__grid">
          <div className="steps__visual" aria-hidden="true">
            <div className="steps__screen">
              <div className="steps__screen-top">
                <span className="steps__lights">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="steps__badge">
                  Step 0{active + 1} · {steps[active].eta}
                </span>
              </div>
              <div className="steps__scenes">
                {scenes.map((Scene, i) => (
                  <div className={`scene ${i === active ? "is-on" : ""}`} key={i}>
                    <Scene />
                  </div>
                ))}
              </div>
              <Inbox className="steps__watermark" size={220} strokeWidth={0.6} />
            </div>
          </div>

          <ol
            className="steps__list"
            ref={list}
            onScroll={(e) => {
              const el = e.currentTarget;
              const item = el.querySelector<HTMLElement>(".steps__item");
              if (!item || el.scrollWidth <= el.clientWidth) return;
              setSwipe(Math.round(el.scrollLeft / (item.offsetWidth + 14)));
            }}
          >
            <span className="steps__rail" aria-hidden="true">
              <span style={{ transform: `scaleY(${(active + 1) / steps.length})` }} />
            </span>
            {steps.map((s, i) => {
              const Scene = scenes[i];
              return (
                <li className={`steps__item ${i === active ? "is-active" : ""}`} data-index={i} key={s.title}>
                  <span className="steps__num">0{i + 1}</span>
                  <div className="steps__body">
                    <div className="steps__top">
                      <h3>{s.title}</h3>
                      <span className="steps__eta">{s.eta}</span>
                    </div>
                    <p>{s.text}</p>
                    <ul className="steps__points">
                      {s.points.map((p) => (
                        <li key={p}>
                          <Check size={14} /> {p}
                        </li>
                      ))}
                    </ul>
                    <div className="steps__inline" aria-hidden="true">
                      <div className="scene is-on">
                        <Scene />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="steps__dots" aria-hidden="true">
            {steps.map((s, i) => (
              <i key={s.title} className={i === swipe ? "is-on" : ""} />
            ))}
            <span>swipe for the next step</span>
          </div>
        </div>
      </div>
    </section>
  );
}
