import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { faqs, links } from "../data/content";
import { Scribble } from "./ui";
import "./Faq.css";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq section" id="faq">
      <div className="shell faq__grid">
        <div className="faq__side">
          <p className="eyebrow">Questions</p>
          <h2 className="h2" data-split>
            Before you{" "}
            <span className="scribble-wrap">
              <span className="script">sign off.</span>
              <Scribble />
            </span>
          </h2>
          <p className="lead">Honest answers to what people ask before they hand an AI the keys to their inbox.</p>
          <a className="btn btn--arrow" href={links.signup}>
            Start free
            <span className="btn__arrow" aria-hidden="true">
              <ArrowRight size={17} />
            </span>
          </a>
          <a className="faq__demo" href={links.demo}>
            Still curious? Book a demo →
          </a>
        </div>

        <ol className="faq__list" data-reveal="stagger">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li className={`faq__item ${isOpen ? "is-open" : ""}`} key={f.q}>
                <h3>
                  <button aria-expanded={isOpen} aria-controls={`faq-a-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    <span className="faq__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="faq__q">{f.q}</span>
                    <span className="faq__icon">
                      <Plus size={18} />
                    </span>
                  </button>
                </h3>
                <div className="faq__a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
