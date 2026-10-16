import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/**
 * Lenis smooth scroll driven by GSAP's ticker, so Lenis and ScrollTrigger share one frame loop.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.4, anchors: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis!.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href");
      if (!a || !id || id === "#") return;
      const target = id === "#top" ? 0 : document.querySelector<HTMLElement>(id);
      if (target === null) return;
      e.preventDefault();
      lenis!.scrollTo(target, { offset: id === "#top" ? 0 : -88, duration: 1.5 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

/**
 * One IntersectionObserver for the whole page. [data-reveal] and .marker elements get `.is-in`
 * once they enter the viewport; CSS does the (transform / opacity / background-size) transition.
 */
export function useReveals() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], .marker:not([data-manual])"));
    els.forEach((el) => {
      if (el.dataset.reveal === "stagger") {
        Array.from(el.children).forEach((child, i) => (child as HTMLElement).style.setProperty("--i", String(i)));
      }
    });
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/**
 * Section headlines ([data-split]): lines rise out of a mask, then any handwritten
 * .script word inside "writes itself" left-to-right, and scribble underlines draw in.
 */
export function useHeadlineSplits(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion()) return;
      let cancelled = false;
      document.fonts?.ready?.then(
        contextSafe!(() => {
          if (cancelled) return;
          gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
            const split = SplitText.create(el, { type: "lines", mask: "lines" });
            const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 86%", once: true } });
            tl.from(split.lines, { yPercent: 108, duration: 1.05, ease: "power4.out", stagger: 0.1 });
            const scripts = el.querySelectorAll(".script");
            if (scripts.length) {
              tl.from(scripts, { clipPath: "inset(-20% 100% -20% 0%)", duration: 1.1, ease: "power2.inOut", stagger: 0.15 }, 0.35);
            }
            const scribbles = el.querySelectorAll(".scribble path");
            if (scribbles.length) tl.from(scribbles, { drawSVG: "0%", duration: 0.9, ease: "power2.out" }, 0.9);
          });
          ScrollTrigger.refresh();
        }),
      );
      return () => {
        cancelled = true;
      };
    },
    { scope },
  );
}

/** Types `text` into `el` over `duration` seconds (as a GSAP tween you can place on a timeline). */
export function typeInto(el: HTMLElement, text: string, duration: number) {
  const o = { n: 0 };
  return gsap.to(o, {
    n: text.length,
    duration,
    ease: "none",
    onUpdate: () => {
      el.textContent = text.slice(0, Math.round(o.n));
    },
  });
}
