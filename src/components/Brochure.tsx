import { useRef, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { gsap, getLenis, useGSAP } from "../lib/motion";
import { brochureChapters, brochurePages, links } from "../data/content";
import { photoUrl } from "../lib/photos";
import { BtnArrow, Scribble } from "./ui";
import "./Brochure.css";

// Pages as leaves of a book: leaf k carries page 2k+1 on the front and 2k+2 on the back.
const leaves = Array.from({ length: brochurePages.length / 2 }, (_, k) => [brochurePages[2 * k], brochurePages[2 * k + 1]]);
const STEPS = leaves.length; // number of page turns
const pagesFor = (step: number) =>
  step === 0 ? [1] : step === STEPS ? [brochurePages.length] : [2 * step, 2 * step + 1];

export function Brochure() {
  const root = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [step, setStep] = useState(0);
  const visible = pagesFor(step);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1061px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)", () => {
        const leafEls = q(".leaf");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q(".bro__pin")[0],
            start: "top top",
            end: `+=${STEPS * 85 + 60}%`,
            pin: true,
            scrub: 0.7,
            onUpdate: (st) => {
              const t = st.progress * tl.duration();
              let s = 0;
              for (let k = 0; k < STEPS; k++) if (t >= tl.labels[`turn${k}`] + 0.5) s = k + 1;
              setStep((prev) => (prev === s ? prev : s));
            },
          },
        });
        tlRef.current = tl;
        // closed book sits centred on its cover; it slides to centre the spread as it opens
        tl.fromTo(q(".book"), { xPercent: -25, rotateX: 14, rotateZ: -3 }, { xPercent: 0, rotateX: 6, rotateZ: 0, duration: 0.8, ease: "power2.inOut" }, 0);
        leafEls.forEach((leaf, k) => {
          const at = 0.3 + k * 1;
          tl.addLabel(`turn${k}`, at)
            .to(leaf, { rotateY: -180, duration: 1, ease: "power1.inOut" }, at)
            .set(leaf, { zIndex: 10 + k }, at + 0.5)
            .fromTo(leaf.querySelectorAll(".leaf__shade"), { opacity: 0 }, { opacity: 1, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" }, at);
        });
        tl.to({}, { duration: 0.4 });
        return () => {
          tlRef.current = null;
        };
      });
    },
    { scope: root },
  );

  // Jump the scroll position to the spread that shows a page
  const goTo = (page: number) => {
    const tl = tlRef.current;
    const st = tl?.scrollTrigger;
    if (!tl || !st) {
      window.open(`${links.brochure}#page=${page}`, "_blank", "noopener");
      return;
    }
    const s = page === 1 ? 0 : Math.min(STEPS, Math.floor(page / 2));
    const t = s === 0 ? 0 : tl.labels[`turn${s - 1}`] + 1;
    const y = st.start + (t / tl.duration()) * (st.end - st.start);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section className="bro panel--dark grain" id="brochure" ref={root}>
      <div className="bro__pin shell">
        <div className="bro__copy">
          <p className="eyebrow">Brochure · 8 pages</p>
          <h2 className="h2" data-split>
            Take MailPilot{" "}
            <span className="scribble-wrap">
              <span className="script">to your team.</span>
              <Scribble />
            </span>
          </h2>
          <p className="lead" data-reveal>
            Scroll to turn the pages. Read it here, print it, or hand it to your boss, your team or your clients. No
            sign-up needed.
          </p>
          <ol className="bro__toc" data-reveal="stagger">
            {brochureChapters.map((c, i) => (
              <li key={c} className={visible.includes(i + 1) ? "is-on" : ""}>
                <button onClick={() => goTo(i + 1)}>
                  <span className="bro__toc-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="bro__toc-t">{c}</span>
                  <span className="bro__toc-p">p.{i + 1}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="bro__ctas" data-reveal>
            <a className="btn btn--bronze btn--arrow" href={links.brochure} download>
              <Download size={17} /> Download the PDF <BtnArrow />
            </a>
            <a className="btn btn--ghost" href={links.brochure} target="_blank" rel="noreferrer">
              Open in browser <ExternalLink size={15} />
            </a>
          </div>
          <p className="bro__meta">PDF · 8 pages · 5.5 MB · free to share</p>
        </div>

        <div className="bro__stage" data-reveal>
          <div className="book">
            {/* inside of the back cover: the last thing you see */}
            <div className="book__end">
              {photoUrl("mia-pilot") && (
                <img className="book__mia" src={photoUrl("mia-pilot")} alt="" loading="lazy" width={720} height={850} />
              )}
              <p className="book__end-kicker">That's the whole story</p>
              <p className="book__end-title">
                Pass it on <span className="script">with love.</span>
              </p>
              <a className="btn btn--bronze btn--sm" href={links.brochure} download>
                <Download size={15} /> Download PDF
              </a>
            </div>
            {leaves.map(([front, back], k) => (
              <div className="leaf" key={front} style={{ zIndex: STEPS - k }}>
                <div className="leaf__face leaf__face--front">
                  <img src={front} alt={`Brochure page ${2 * k + 1}: ${brochureChapters[2 * k]}`} loading={k === 0 ? "eager" : "lazy"} decoding="async" width={1100} height={1556} />
                  <span className="leaf__shade" />
                </div>
                <div className="leaf__face leaf__face--back">
                  <img src={back} alt={`Brochure page ${2 * k + 2}: ${brochureChapters[2 * k + 1]}`} loading="lazy" decoding="async" width={1100} height={1556} />
                  <span className="leaf__shade" />
                </div>
              </div>
            ))}
          </div>
          <p className="bro__pager" aria-live="polite">
            <span className="bro__dots" aria-hidden="true">
              {Array.from({ length: STEPS + 1 }, (_, i) => (
                <i key={i} className={i === step ? "is-on" : ""} />
              ))}
            </span>
            {visible.length === 1 ? (step === 0 ? "Cover" : `Page ${visible[0]}`) : `Pages ${visible[0]} & ${visible[1]}`}
          </p>

          {/* small screens: swipe through the pages */}
          <div className="bro__swipe">
            {brochurePages.map((src, i) => (
              <a key={src} href={`${links.brochure}#page=${i + 1}`} target="_blank" rel="noreferrer" className="bro__swipe-page">
                <img src={src} alt={`Brochure page ${i + 1}: ${brochureChapters[i]}`} loading="lazy" decoding="async" width={1100} height={1556} />
                <span>p.{i + 1}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
