import { Fragment, useEffect, useRef, useState } from "react";
import { Play, Send } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";
import { links, platforms } from "../data/content";
import { whenLoaded } from "../lib/loader";
import { photoUrl } from "../lib/photos";
import { Avatar, PlatformIcon, Scribble } from "./ui";
import "./Hero.css";

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="hw">
            <span className="hw__in">{w}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

const recipients = [
  { id: "maya", name: "Maya Chen", initials: "MC", tone: "teal" as const, note: "Product Lead · Northstar" },
  { id: "jon", name: "Jon Bell", initials: "JB", tone: "bronze" as const, note: "Partner · Studio Vale" },
  { id: "priya", name: "Priya Shah", initials: "PS", tone: "dark" as const, note: "Customer Success · Relay" },
];

/** Cycles the "To:" field so the letter feels addressed to someone real. */
function Recipient() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % recipients.length), 2600);
    return () => window.clearInterval(id);
  }, []);
  const r = recipients[i];
  return (
    <span className="lt__to-chip" key={r.id}>
      <Avatar name={r.id} initials={r.initials} tone={r.tone} />
      <b>{r.name}</b>
      <em>{r.note}</em>
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const desk = photoUrl("hero-desk");

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) return;

      // ---- pointer: the letter tilts toward the cursor ----
      const tilt = q(".lt__tilt")[0] as HTMLElement;
      const rx = gsap.quickTo(tilt, "rotateX", { duration: 1, ease: "power3.out" });
      const ry = gsap.quickTo(tilt, "rotateY", { duration: 1, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        // keep the letter flat while the scroll scene is posting it
        if (window.scrollY > 24) return void (rx(0), ry(0));
        ry((e.clientX / window.innerWidth - 0.5) * 7);
        rx(-(e.clientY / window.innerHeight - 0.5) * 5);
      };
      root.current!.addEventListener("pointermove", onMove);

      // ---- scroll: fold in thirds → into the envelope → sealed → off it flies ----
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1061px) and (min-height: 640px)", () => {
        const lt = q(".lt")[0] as HTMLElement;
        const [p1, p2, p3] = ["1", "2", "3"].map((n) => q(`.lt__p${n}`)[0] as HTMLElement);
        const env = q(".env2-back")[0] as HTMLElement;
        // Untransformed geometry in stage coordinates (offsets ignore transforms).
        const geo = () => {
          const ltTop = tilt.offsetTop + lt.offsetTop;
          const ltc = ltTop + lt.offsetHeight / 2;
          const p2Top = ltTop + p2.offsetTop;
          const p2Bot = p2Top + p2.offsetHeight;
          // footprint once folded: p3 folds up over p2, p1 folds down over it
          const top = Math.min(p2Top, p2Bot - p3.offsetHeight);
          const bot = Math.max(p2Bot, p2Top + p1.offsetHeight);
          const scale = (env.offsetWidth * 0.82) / lt.offsetWidth;
          const envTop = env.offsetTop;
          const envH = env.offsetHeight;
          // y that lands the folded letter's top / bottom edge on a given line
          const topAt = (line: number) => line - ltc - (top - ltc) * scale;
          const botAt = (line: number) => line - ltc - (bot - ltc) * scale;
          return {
            scale,
            hover: Math.max(botAt(envTop - envH * 0.05), topAt(100)), // clear of the envelope, below the nav
            inside: topAt(envTop + envH * 0.1),
          };
        };
        gsap
          .timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=165%",
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
              onUpdate: (self) => self.progress > 0.01 && (rx(0), ry(0)),
            },
          })
          .to(q(".note, .lt__seal, .hero__scroll"), { autoAlpha: 0, duration: 0.25 }, 0)
          .to(q(".lt__sheet"), { y: 90, autoAlpha: 0, duration: 0.4 }, 0)
          .to(q(".lt__p3"), { rotateX: 179, z: 2, duration: 1 }, 0.1)
          .to(q(".lt__p1"), { rotateX: -179, z: 8, duration: 1 }, 0.9)
          // the folded letter lifts and shrinks first, so the envelope never passes in front of it
          .to(lt, { scale: () => geo().scale, y: () => geo().hover, rotation: -2.5, duration: 0.75 }, 1.7)
          .fromTo(q(".env2-shadow, .env2-back, .env2-flap, .env2-front"), { yPercent: 150, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, 2.05)
          // in through the opening: in front of the envelope's inside, behind its pockets
          .to(lt, { y: () => geo().inside, rotation: 0, duration: 0.6 }, 2.9)
          .set(q(".env2-flap"), { zIndex: 4 }, 3.55)
          .fromTo(q(".env2-flap__in"), { rotateX: 180 }, { rotateX: 0, duration: 0.45, ease: "power2.in" }, 3.6)
          .to(q(".lt__tilt"), { autoAlpha: 0, duration: 0.05 }, 4.0)
          .fromTo(q(".env2-seal .wax"), { scale: 2.6, autoAlpha: 0, rotate: -40 }, { scale: 1, autoAlpha: 1, rotate: -6, duration: 0.32, ease: "back.out(2)" }, 4.05)
          .to(q(".env2-part, .lt__tilt"), { x: "62vw", y: "-55vh", rotate: 16, scale: 0.5, autoAlpha: 0, duration: 0.9, ease: "power2.in" }, 4.45)
          .fromTo(q(".hero__sent"), { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" }, 4.95)
          .to({}, { duration: 0.4 });
      });

      // ---- entrance: plays as the entry loader opens (it waits for fonts, so words measure correctly) ----
      let cancelled = false;
      const intro = contextSafe!(() => {
        if (cancelled) return;
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(q(".lt__sheet"), { y: 140, autoAlpha: 0, duration: 1.6, stagger: 0.12 }, 0)
          .from(tilt, { y: 160, autoAlpha: 0, duration: 1.6 }, 0.1)
          .from(q(".lt__meta > *, .lt__to"), { y: 14, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, 0.6)
          .from(q(".hw__in"), { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.06 }, 0.7)
          .from(q(".lt .script"), { clipPath: "inset(-30% 100% -30% 0%)", duration: 1.2, ease: "power2.inOut" }, 1.2)
          .from(q(".lt h1 .scribble path"), { drawSVG: "0%", duration: 0.8, stagger: 0.1, ease: "power2.out" }, 2)
          .from(q(".lt__body, .lt__actions, .lt__works, .lt__postmark"), { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 1.2)
          .from(q(".lt__sign-name"), { clipPath: "inset(-30% 100% -30% 0%)", duration: 1.1, ease: "power2.inOut" }, 1.9)
          .from(q(".lt__seal"), { scale: 1.8, rotate: -50, autoAlpha: 0, duration: 0.5, ease: "back.out(2)" }, 2.4)
          .from(q(".note"), { autoAlpha: 0, duration: 0.6, stagger: 0.25 }, 2.4)
          .from(q(".note path"), { drawSVG: "0%", duration: 0.9, stagger: 0.25, ease: "power2.out" }, 2.6);
      });
      whenLoaded().then(intro);
      return () => {
        cancelled = true;
        root.current?.removeEventListener("pointermove", onMove);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section className="hero panel-wrap" id="top" ref={root}>
      <div className="panel panel--dark hero__frame grain">
        {desk && <img className="hero__desk" src={desk} alt="" aria-hidden="true" />}
        <div className="hero__stage">
          <span className="lt__sheet lt__sheet--1" aria-hidden="true" />
          <span className="lt__sheet lt__sheet--2" aria-hidden="true" />

          <div className="lt__tilt">
            <article className="lt">
              {/* panel 1 — address & headline */}
              <div className="lt__p lt__p1">
                <div className="lt__face">
                  <div className="lt__meta">
                    <span className="lt__from">
                      <span className="dot dot--live" /> New draft · written by MailPilot, in your voice
                    </span>
                    <span className="lt__stamp" aria-hidden="true">
                      <img src="/mailpilot-mark.png" alt="" width={391} height={313} />
                    </span>
                  </div>
                  <p className="lt__to">
                    <span className="lt__label">To</span>
                    <Recipient />
                  </p>
                  <span className="lt__postmark" aria-hidden="true">
                    <svg viewBox="0 0 200 200">
                        <defs>
                        <path id="pm-ring" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
                      </defs>
                      <circle cx="100" cy="100" r="92" />
                      <circle cx="100" cy="100" r="58" />
                      <text>
                        <textPath href="#pm-ring">DRAFTED IN YOUR VOICE · MAILPILOT · AIR MAIL ·</textPath>
                      </text>
                      <text x="100" y="94" textAnchor="middle" className="pm-big">
                        TODAY
                      </text>
                      <text x="100" y="118" textAnchor="middle" className="pm-small">
                        9:42 AM
                      </text>
                    </svg>
                    <i />
                  </span>
                  {/* named once for screen readers; the words are split for the animation */}
                  <h1 className="lt__title" aria-label="Your inbox, answered in your voice.">
                    <Words text="Your inbox, answered" />{" "}
                    <span className="scribble-wrap">
                      <span className="hw hw--script">
                        <span className="hw__in script">in your voice.</span>
                      </span>
                      <Scribble />
                    </span>
                  </h1>
                </div>
                <div className="lt__back" />
              </div>

              {/* panel 2 — body */}
              <div className="lt__p lt__p2">
                <div className="lt__face">
                  <p className="lt__body">
                    MailPilot reads every email, drafts the reply the way <i>you</i> would write it, runs your follow-ups
                    and tells you before an important relationship goes cold. Nothing leaves without your say.
                  </p>
                </div>
              </div>

              {/* panel 3 — sign-off & send */}
              <div className="lt__p lt__p3">
                <div className="lt__face">
                  <div className="lt__foot">
                    <div className="lt__sign">
                      <span>Best,</span>
                      <span className="lt__sign-name">MailPilot</span>
                    </div>
                    <div className="lt__actions">
                      <a className="lt__send" href={links.signup}>
                        <Send size={17} /> Send · Start free
                      </a>
                      <a className="lt__ghost" href="#demo">
                        <Play size={13} fill="currentColor" /> See it work
                      </a>
                    </div>
                  </div>
                  <p className="lt__works">
                    <span>Works with</span>
                    {platforms.map((p) => (
                      <span className="lt__works-item" key={p.name}>
                        <PlatformIcon name={p.name} size={15} />
                        {p.name}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="lt__back" />
              </div>

              <div className="lt__seal" aria-hidden="true">
                <img src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
              </div>
            </article>
          </div>

          {/* handwritten margin notes */}
          <p className="note note--l" aria-hidden="true">
            <span>sounds exactly like you</span>
            <svg viewBox="0 0 120 70">
              <path d="M10 8 C 50 4, 92 24, 110 60 M96 56 L110 60 L112 45" />
            </svg>
          </p>
          <p className="note note--r" aria-hidden="true">
            <svg viewBox="0 0 120 70">
              <path d="M110 62 C 76 64, 36 46, 12 10 M8 24 L12 10 L25 15" />
            </svg>
            <span>you approve every send</span>
          </p>

          {/* the envelope it ends up in — drawn as a real envelope back: inside, pockets, top flap, wax seal */}
          <div className="env2-part env2-shadow" aria-hidden="true" />
          <div className="env2-part env2-back" aria-hidden="true">
            <svg viewBox="0 0 160 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="env-inside" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#9c7e57" />
                  <stop offset="0.55" stopColor="#c2a77f" />
                  <stop offset="1" stopColor="#d6c09c" />
                </linearGradient>
              </defs>
              <rect width="160" height="100" rx="3" fill="url(#env-inside)" />
            </svg>
          </div>
          <div className="env2-part env2-front" aria-hidden="true">
            <svg viewBox="0 0 160 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="env-left" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#e7d6b9" />
                  <stop offset="1" stopColor="#f1e5cf" />
                </linearGradient>
                <linearGradient id="env-right" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0" stopColor="#e3d1b2" />
                  <stop offset="1" stopColor="#eee0c8" />
                </linearGradient>
                <linearGradient id="env-bottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f6eddc" />
                  <stop offset="1" stopColor="#e8d9be" />
                </linearGradient>
                <filter id="env-sh-side" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="0" stdDeviation="0.9" floodColor="#4a3218" floodOpacity="0.18" />
                </filter>
                <filter id="env-sh-bottom" x="-10%" y="-20%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="-0.7" stdDeviation="1.1" floodColor="#4a3218" floodOpacity="0.26" />
                </filter>
              </defs>
              <path d="M0 0 L73 53 C76.5 55.5 76.5 58.5 73 61 L0 100 Z" fill="url(#env-left)" filter="url(#env-sh-side)" />
              <path d="M160 0 L87 53 C83.5 55.5 83.5 58.5 87 61 L160 100 Z" fill="url(#env-right)" filter="url(#env-sh-side)" />
              <path d="M0 100 L71 47.5 C76.5 43.5 83.5 43.5 89 47.5 L160 100 Z" fill="url(#env-bottom)" filter="url(#env-sh-bottom)" />
              <path className="env2__crease" d="M0 100 L71 47.5 C76.5 43.5 83.5 43.5 89 47.5 L160 100" />
            </svg>
            <span className="env2__light" />
          </div>
          <div className="env2-part env2-flap" aria-hidden="true">
            <span className="env2-flap__in">
              <svg viewBox="0 0 160 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="env-top" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f2e6d0" />
                    <stop offset="1" stopColor="#e6d4b5" />
                  </linearGradient>
                  <filter id="env-sh-top" x="-10%" y="-10%" width="120%" height="140%">
                    <feDropShadow dx="0" dy="1.3" stdDeviation="1.4" floodColor="#3a2610" floodOpacity="0.3" />
                  </filter>
                </defs>
                <path d="M0 0 L160 0 L89 58 C84 62.5 76 62.5 71 58 Z" fill="url(#env-top)" filter="url(#env-sh-top)" />
              </svg>
            </span>
          </div>
          <div className="env2-part env2-seal" aria-hidden="true">
            <span className="wax">
              <svg viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="wax-fill" cx="0.38" cy="0.32" r="0.75">
                    <stop offset="0" stopColor="#e6c79c" />
                    <stop offset="0.45" stopColor="#b38f6a" />
                    <stop offset="1" stopColor="#6f4f30" />
                  </radialGradient>
                  <filter id="wax-sh" x="-20%" y="-20%" width="140%" height="150%">
                    <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#1d1208" floodOpacity="0.45" />
                  </filter>
                </defs>
                <g filter="url(#wax-sh)">
                  <path d="M50 7 C62 6 71 13 79 16 C89 20 94 30 92 42 C97 51 95 63 89 71 C86 81 77 88 66 90 C58 96 46 96 37 91 C26 90 15 82 11 71 C5 62 5 50 9 41 C9 28 18 17 30 12 C36 8 43 7 50 7 Z" fill="url(#wax-fill)" />
                  <path d="M73 86 C76 93 73 98 69 96 C66 94 67 90 69 87 Z" fill="#8a6644" />
                </g>
                <circle cx="50" cy="50" r="27" fill="none" stroke="rgb(70 44 20 / 0.4)" strokeWidth="2.2" />
                <circle cx="50" cy="50" r="24.5" fill="none" stroke="rgb(255 236 205 / 0.28)" strokeWidth="1.2" />
                <ellipse cx="37" cy="29" rx="13" ry="6.5" fill="rgb(255 245 225 / 0.28)" transform="rotate(-24 37 29)" />
              </svg>
              <img src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
            </span>
          </div>
          <p className="hero__sent" aria-hidden="true">
            Sent. <span className="script">The next one's already drafted.</span>
          </p>
          <p className="hero__scroll" aria-hidden="true">
            Scroll to send it ↓
          </p>
        </div>
      </div>
    </section>
  );
}
