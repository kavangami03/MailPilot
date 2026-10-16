import { useRef } from "react";
import { CalendarDays, Send } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";
import { links } from "../data/content";
import { Photo, Scribble } from "./ui";
import "./FinalCta.css";

export function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const stamp = q(".bigstamp")[0] as HTMLElement;
      const rx = gsap.quickTo(stamp, "rotateX", { duration: 0.9, ease: "power3.out" });
      const ry = gsap.quickTo(stamp, "rotateY", { duration: 0.9, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = stamp.getBoundingClientRect();
        ry(((e.clientX - (r.left + r.width / 2)) / r.width) * 14);
        rx(-((e.clientY - (r.top + r.height / 2)) / r.height) * 12);
      };
      const reset = () => {
        rx(0);
        ry(0);
      };
      root.current!.addEventListener("pointermove", onMove);
      root.current!.addEventListener("pointerleave", reset);
      gsap.from(stamp, {
        y: 120,
        rotate: 12,
        autoAlpha: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: stamp, start: "top 85%", once: true },
      });
      gsap.from(q(".bigstamp__mark"), {
        scale: 2.2,
        autoAlpha: 0,
        rotate: -40,
        duration: 0.6,
        delay: 0.6,
        ease: "back.out(2)",
        scrollTrigger: { trigger: stamp, start: "top 85%", once: true },
      });
      return () => {
        root.current?.removeEventListener("pointermove", onMove);
        root.current?.removeEventListener("pointerleave", reset);
      };
    },
    { scope: root },
  );

  return (
    <section className="cta section" id="start" ref={root}>
      <div className="shell cta__grid">
        <div className="cta__copy">
          <p className="eyebrow">Your next step</p>
          <h2 className="h2 cta__title" data-split>
            Stop managing your inbox.{" "}
            <span className="script-line">
              <span className="scribble-wrap">
                <span className="script">Start managing your work.</span>
                <Scribble />
              </span>
            </span>
          </h2>
          <p className="lead" data-reveal>
            Every reply drafted in your voice. Every important relationship kept warm. Not one follow-up dropped. Your
            Persona takes about fifteen minutes to set up.
          </p>
          <a className="cta__demo" href={links.demo} data-reveal>
            <CalendarDays size={18} /> Rather talk it through? Book a team demo
          </a>
        </div>

        <div className="cta__stage">
          <div className="bigstamp">
            <div className="bigstamp__paper">
              <div className="bigstamp__art">
                <Photo name="letter-sealed" alt="" position="62% 50%">
                  <img className="bigstamp__logo" src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
                </Photo>
                <span className="bigstamp__value">
                  200<small>credits / mo</small>
                </span>
              </div>
              <p className="bigstamp__line">MailPilot · AI email agent · first class</p>
              <a className="bigstamp__send" href={links.signup}>
                <Send size={18} /> Send · Start free
              </a>
              <p className="bigstamp__fine">Free starter credits · No credit card</p>
            </div>
            <span className="bigstamp__mark" aria-hidden="true">
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="cta-ring" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
                </defs>
                <circle cx="100" cy="100" r="92" />
                <circle cx="100" cy="100" r="58" />
                <text>
                  <textPath href="#cta-ring">READY WHEN YOU ARE · SUPERMIA · MAILPILOT ·</textPath>
                </text>
                <text x="100" y="108" textAnchor="middle" className="pm-big">
                  FREE
                </text>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
