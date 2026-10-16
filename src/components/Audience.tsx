import { useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { gsap, useGSAP } from "../lib/motion";
import { crew } from "../data/content";
import { Photo, Scribble } from "./ui";
import "./Audience.css";

export function Audience() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const mover = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useGSAP(
    () => {
      const card = root.current!.querySelector<HTMLElement>(".aud__preview")!;
      mover.current = {
        x: gsap.quickTo(card, "x", { duration: 0.6, ease: "power3.out" }),
        y: gsap.quickTo(card, "y", { duration: 0.6, ease: "power3.out" }),
      };
    },
    { scope: root },
  );

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !mover.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    mover.current.x(e.clientX - r.left);
    mover.current.y(e.clientY - r.top);
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

        <div
          className={`aud__list ${hovering ? "is-hovering" : ""}`}
          onPointerMove={onMove}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
          onPointerLeave={() => setHovering(false)}
        >
          {crew.map((c, i) => (
            <article className={`aud__row ${active === i ? "is-open" : ""}`} key={c.key} onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}>
              <button className="aud__trigger" aria-expanded={active === i} onClick={() => setActive(i)}>
                <span className="aud__num">0{i + 1}</span>
                <span className="aud__title">{c.title}</span>
                <span className="aud__tag">{c.tag}</span>
                <ArrowUpRight className="aud__arrow" size={30} />
              </button>
              <div className="aud__detail">
                <div>
                  <div className="aud__mobile-photo">
                    <Photo name={c.photo} alt="">
                      <span className="aud__initials">{c.initials}</span>
                    </Photo>
                  </div>
                  <p className="aud__pain">“{c.pain}”</p>
                  <ul className="aud__gets">
                    {c.gets.map((g) => (
                      <li key={g}>
                        <Check size={16} /> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}

          <div className="aud__preview" aria-hidden="true">
            {crew.map((c, i) => (
              <div className={`aud__card ${active === i ? "is-on" : ""}`} key={c.key}>
                <Photo name={c.photo} alt="">
                  <span className="aud__initials">{c.initials}</span>
                </Photo>
                <span className="aud__card-label">{c.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
