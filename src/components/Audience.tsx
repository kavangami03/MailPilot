import { useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { crew } from "../data/content";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";
import { Photo, Scribble } from "./ui";
import "./Audience.css";

const v = (i: number) => ({ ["--i" as string]: i });

export function Audience() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const intent = useRef(0);
  const pending = useRef(-1);
  const lockUntil = useRef(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(".wp"), {
        y: 70,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: q(".who")[0], start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  const open = (i: number) => {
    window.clearTimeout(intent.current);
    pending.current = -1;
    if (i === activeRef.current) return;
    activeRef.current = i;
    lockUntil.current = performance.now() + 750; // no further switching while this one is still opening
    setActive(i);
  };

  // Desktop hover: a panel opens only after the mouse actually moves over it and settles there.
  // Panels shifting under a still cursor never count, which is what used to make them bounce back and forth.
  const hover = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || i === activeRef.current || pending.current === i) return;
    window.clearTimeout(intent.current);
    pending.current = i;
    const wait = Math.max(160, lockUntil.current - performance.now());
    intent.current = window.setTimeout(() => open(i), wait);
  };
  const unhover = (i: number) => () => {
    if (pending.current !== i) return;
    window.clearTimeout(intent.current);
    pending.current = -1;
  };

  return (
    <section className="aud section" id="who" ref={root}>
      <div className="shell">
        <header className="section-head section-head--split">
          <div>
            <p className="eyebrow">Who it's for</p>
            <h2 className="h2" data-split>
              Built for people whose{" "}
              <span className="scribble-wrap">
                <span className="script">inbox is the job.</span>
                <Scribble />
              </span>
            </h2>
          </div>
          <p className="lead" data-reveal>
            If your pipeline, your clients or your company run through email, MailPilot was built for you.
          </p>
        </header>

        <div className="who">
          {crew.map((c, i) => {
            const on = i === active;
            return (
              <article
                key={c.key}
                className={`wp ${on ? "is-on" : ""}`}
                onPointerMove={hover(i)}
                onPointerLeave={unhover(i)}
              >
                <div className="wp__photo">
                  <Photo name={c.photo} alt={c.alt}>
                    <span className="wp__initials">{c.initials}</span>
                  </Photo>
                  <span className="wp__dim" aria-hidden="true" />
                  <span className="wp__num">0{i + 1}</span>
                  <span className="wp__vtitle" aria-hidden="true">
                    {c.title}
                  </span>
                  <h3 className="wp__title">{c.title}</h3>
                </div>

                <button
                  className="wp__open"
                  aria-expanded={on}
                  aria-controls={`wp-${c.key}`}
                  onClick={() => open(i)}
                  onFocus={() => open(i)}
                >
                  <span className="sr-only">Show what MailPilot does for {c.title.toLowerCase()}</span>
                  <Plus size={18} aria-hidden="true" />
                </button>

                <div className="wp__letter" id={`wp-${c.key}`}>
                  <div className="wp__paper">
                    <span className="wp__pm" aria-hidden="true">
                      <svg viewBox="0 0 200 200">
                        <defs>
                          <path id={`wp-pm-${c.key}`} d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
                        </defs>
                        <circle cx="100" cy="100" r="92" />
                        <circle cx="100" cy="100" r="56" />
                        <text>
                          <textPath href={`#wp-pm-${c.key}`}>BUILT FOR YOUR INBOX · MAILPILOT · AIR MAIL ·</textPath>
                        </text>
                        <text x="100" y="117" textAnchor="middle" className="wp__pm-num">
                          0{i + 1}
                        </text>
                      </svg>
                    </span>
                    <p className="wp__to" style={v(0)}>
                      <span>To</span>
                      {c.tag}
                    </p>
                    <p className="wp__pain" style={v(1)}>
                      “{c.pain}”
                    </p>
                    <p className="wp__label" style={v(2)}>
                      What MailPilot does for you
                    </p>
                    <ul className="wp__gets" style={v(2)}>
                      {c.gets.map((g, k) => (
                        <li key={g} style={v(3 + k)}>
                          <Check size={14} strokeWidth={2.6} />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="wp__sign" style={v(6)}>
                      Best,
                      <span>MailPilot</span>
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
