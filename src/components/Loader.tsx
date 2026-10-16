import { useEffect, useRef, useState } from "react";
import { gsap, getLenis, prefersReducedMotion, ScrollTrigger } from "../lib/motion";
import { markLoaded } from "../lib/loader";
import { photoUrl } from "../lib/photos";
import "./Loader.css";

const MESSAGES = ["reading your inbox…", "learning your voice…", "drafting the reply…", "sealing it…"];
const MIN_MS = 1900; // long enough to enjoy, short enough not to annoy
const MAX_MS = 7000; // never hold the page hostage on a slow asset

// Resolves when an image is decoded (or fails), so it's ready the moment the page is revealed.
const loadImage = (src?: string) =>
  new Promise<void>((done) => {
    if (!src) return done();
    const img = new Image();
    img.onload = img.onerror = () => done();
    img.src = src;
  });

export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const html = document.documentElement;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const finish = () => {
      html.classList.remove("is-loading");
      getLenis()?.start();
      ScrollTrigger.refresh(); // re-measure pinned scenes now that fonts, images and scrolling are all in place
      setGone(true);
    };

    // Real progress: fonts, the hero photo and the logos
    const tasks = [document.fonts?.ready ?? Promise.resolve(), loadImage(photoUrl("hero-desk")), loadImage("/mailpilot-logo.png"), loadImage("/mailpilot-mark-light.png")];
    let done = 0;
    const progress = { v: 0, target: 0 };
    tasks.forEach((t) => t.then(() => (progress.target = ++done / tasks.length)));
    const ready = Promise.race([Promise.all(tasks), new Promise((r) => setTimeout(r, MAX_MS))]);

    const content = q(".ldr__content")[0] as HTMLElement;
    if (prefersReducedMotion()) {
      content.style.visibility = "visible";
      ready.then(() => {
        markLoaded();
        gsap.to(el, { autoAlpha: 0, duration: 0.3, onComplete: finish });
      });
      return;
    }

    const ctx = gsap.context(() => {
      const count = q(".ldr__count b")[0] as HTMLElement;
      const bar = q(".ldr__bar i")[0] as HTMLElement;
      const msg = q(".ldr__msg span");

      // the counter eases toward real progress, but never faster than the line drawing
      const draw = gsap
        .timeline({ defaults: { ease: "power2.inOut" } })
        .from(q(".ldr__top > *, .ldr__foot > *"), { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" }, 0)
        .fromTo(q(".ldr__line"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, stagger: 0.14 }, 0.1)
        .from(q(".ldr__fill"), { autoAlpha: 0, duration: 0.8 }, 0.9)
        .from(q(".ldr__mark"), { y: 14, autoAlpha: 0, duration: 0.7, ease: "expo.out" }, 1.1);
      content.style.visibility = "visible";

      const tick = () => {
        const cap = Math.min(draw.progress(), 0.96);
        progress.v += (Math.min(progress.target, cap) - progress.v) * 0.08;
        count.textContent = String(Math.round(progress.v * 100)).padStart(3, "0");
        bar.style.transform = `scaleX(${progress.v})`;
      };
      gsap.ticker.add(tick);

      // rotating handwritten status lines
      gsap.set(msg, { yPercent: 100, autoAlpha: 0 });
      const msgs = gsap.timeline({ repeat: -1 });
      msg.forEach((m) => {
        msgs.to(m, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out" }).to(m, { yPercent: -100, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, "+=0.55");
      });

      Promise.all([ready, new Promise((r) => setTimeout(r, MIN_MS))]).then(() => {
        gsap.ticker.remove(tick);
        msgs.kill();
        gsap
          .timeline()
          .to(progress, {
            v: 1,
            duration: 0.45,
            ease: "power2.out",
            onUpdate: () => {
              count.textContent = String(Math.round(progress.v * 100)).padStart(3, "0");
              bar.style.transform = `scaleX(${progress.v})`;
            },
          })
          .to(q(".ldr__msg span"), { autoAlpha: 0, duration: 0.2 }, 0)
          .fromTo(q(".ldr__msg-done"), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out" }, 0.1)
          // the seal stamps onto the flap
          .fromTo(q(".ldr__seal"), { scale: 2.4, rotate: -40, autoAlpha: 0 }, { scale: 1, rotate: -8, autoAlpha: 1, duration: 0.42, ease: "back.out(2.2)" }, 0.3)
          .fromTo(q(".ldr__ring"), { scale: 0.6, autoAlpha: 0.9 }, { scale: 2.2, autoAlpha: 0, duration: 0.8, ease: "expo.out" }, 0.55)
          .to(q(".ldr__env"), { y: 4, duration: 0.08, yoyo: true, repeat: 1 }, 0.55)
          // then the envelope opens and the screen parts along the fold
          .to(q(".ldr__content"), { autoAlpha: 0, y: -24, scale: 0.96, duration: 0.5, ease: "power2.in" }, 1.15)
          .add(markLoaded, 1.45)
          .to(q(".ldr__half--top"), { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, 1.4)
          .to(q(".ldr__half--bottom"), { yPercent: 100, duration: 1.05, ease: "expo.inOut" }, 1.4)
          .add(finish);
      });
    }, el);

    return () => ctx.revert();
  }, []);

  if (gone) return null;
  return (
    <div className="ldr" ref={root} role="status" aria-live="polite" aria-label="Loading MailPilot">
      <div className="ldr__half ldr__half--top grain" />
      <div className="ldr__half ldr__half--bottom grain" />

      <div className="ldr__content">
        <div className="ldr__top">
          <img src="/mailpilot-logo-light.png" alt="MailPilot" width={1536} height={313} />
          <span>AI email agent · by SuperMIA</span>
        </div>

        <div className="ldr__stage" aria-hidden="true">
          <div className="ldr__env">
            <svg viewBox="0 0 320 210">
              <rect className="ldr__fill" x="6" y="6" width="308" height="198" rx="12" />
              <rect className="ldr__line" x="6" y="6" width="308" height="198" rx="12" />
              <path className="ldr__line" d="M10 196 L130 104 M310 196 L190 104" />
              <path className="ldr__line ldr__flapline" d="M8 12 L160 126 L312 12" />
            </svg>
            <img className="ldr__mark" src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
            <span className="ldr__ring" />
            <span className="ldr__seal">
              <img src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
            </span>
          </div>
        </div>

        <div className="ldr__foot">
          <p className="ldr__count">
            <b>000</b>
            <small>%</small>
          </p>
          <p className="ldr__msg">
            {MESSAGES.map((m) => (
              <span key={m}>{m}</span>
            ))}
            <span className="ldr__msg-done">ready. delivered.</span>
          </p>
        </div>
        <div className="ldr__bar">
          <i />
        </div>
      </div>
    </div>
  );
}
