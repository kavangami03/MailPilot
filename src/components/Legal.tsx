import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  ExternalLink,
  FileCheck2,
  Lock,
  Mail,
  MapPin,
  MegaphoneOff,
  Phone,
  RefreshCw,
  Scale,
  Trash2,
  UserCheck,
} from "lucide-react";
import { company, legal, type HighlightIcon, type LegalDoc } from "../data/legal";
import { links } from "../data/content";
import { useReveals, useSmoothScroll } from "../lib/motion";
import { Footer } from "./Footer";
import { Logo } from "./Logo";
import "./Nav.css";
import "./Legal.css";

const ICONS: Record<HighlightIcon, typeof Lock> = {
  ads: MegaphoneOff,
  ai: BrainCircuit,
  lock: Lock,
  delete: Trash2,
  content: FileCheck2,
  charge: UserCheck,
  renew: RefreshCw,
  law: Scale,
};

function HighlightGlyph({ name }: { name: HighlightIcon }) {
  const Icon = ICONS[name];
  return <Icon size={19} strokeWidth={1.9} />;
}

export function Legal({ doc }: { doc: LegalDoc }) {
  const d = legal[doc];
  const [active, setActive] = useState(d.sections[0].id);
  const [wide] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 961px)").matches);
  const tocList = useRef<HTMLOListElement>(null);
  useSmoothScroll();
  useReveals();

  // Highlight the section being read
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-30% 0px -60% 0px" },
    );
    d.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [d]);

  // keep the section you're reading in view inside the contents list
  useEffect(() => {
    const list = tocList.current;
    const item = list?.querySelector<HTMLElement>("a.is-on");
    if (!list || !item || list.scrollHeight <= list.clientHeight) return;
    const offset = item.getBoundingClientRect().top - list.getBoundingClientRect().top;
    list.scrollTo({ top: list.scrollTop + offset - list.clientHeight / 2 + item.offsetHeight / 2, behavior: "smooth" });
  }, [active]);

  return (
    <>
      <header className="lg-bar">
        <div className="lg-bar__pill">
          <Logo href="/" />
          <a className="lg-bar__back" href="/">
            <ArrowLeft size={16} /> <span>Back to MailPilot</span>
          </a>
          <a className="nav__cta lg-bar__cta" href={links.signup}>
            Start free <ArrowUpRight size={16} />
          </a>
        </div>
      </header>

      <main id="main">
        <section className="lg-hero panel-wrap">
          <div className="panel panel--dark grain lg-hero__panel">
            <div className="shell lg-hero__inner">
              <nav className="lg-switch" aria-label="Legal documents">
                <a
                  href="/privacy/"
                  className={doc === "privacy" ? "is-on" : ""}
                  aria-current={doc === "privacy" ? "page" : undefined}
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms/"
                  className={doc === "terms" ? "is-on" : ""}
                  aria-current={doc === "terms" ? "page" : undefined}
                >
                  Terms &amp; Conditions
                </a>
              </nav>
              <h1 className="lg-hero__title">
                {d.title} <span className="script">{d.script}</span>
              </h1>
              <p className="lg-hero__intro">{d.intro}</p>
              <p className="lg-hero__meta">
                <span>Last updated {d.updated}</span>
                <span>{company.name}</span>
                <span>{d.sections.length} sections</span>
              </p>
            </div>
          </div>
        </section>

        <div className="shell lg-body">
          <aside className="lg-toc">
            <details open={wide}>
              <summary>On this page</summary>
              <ol ref={tocList} data-lenis-prevent>
                {d.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className={active === s.id ? "is-on" : ""}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#contact" className={active === "contact" ? "is-on" : ""}>
                    <span>{String(d.sections.length + 1).padStart(2, "0")}</span>
                    Contact
                  </a>
                </li>
              </ol>
            </details>
          </aside>

          <article className="lg-sheet">
            <div className="lg-short" data-reveal="stagger">
              <p className="lg-short__label">In short</p>
              {d.highlights.map((h) => (
                <div className="lg-short__card" key={h.title}>
                  <span className="lg-short__icon" aria-hidden="true">
                    <HighlightGlyph name={h.icon} />
                  </span>
                  <strong>{h.title}</strong>
                  <span>{h.text}</span>
                </div>
              ))}
            </div>

            <p className="lg-note">
              This page puts our official {d.title.toLowerCase()} into plain language. The{" "}
              <a href={d.official} target="_blank" rel="noreferrer">
                full official version
              </a>{" "}
              is the binding text and applies if anything here differs.
            </p>

            {d.sections.map((s, i) => (
              <section className="lg-sec" id={s.id} key={s.id}>
                <h2>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section className="lg-sec lg-contact" id="contact">
              <h2>
                <span>{String(d.sections.length + 1).padStart(2, "0")}</span>
                Contact
              </h2>
              <p>
                Questions about this {doc === "privacy" ? "policy" : "agreement"}? Write to us, and a real person will
                reply.
              </p>
              <div className="lg-contact__card">
                <span className="lg-contact__seal" aria-hidden="true">
                  <img src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
                </span>
                <div>
                  <strong>{company.name}</strong>
                  <a href={`mailto:${company.email}`}>
                    <Mail size={15} /> {company.email}
                  </a>
                  <a href={company.phoneHref}>
                    <Phone size={15} /> {company.phone}
                  </a>
                  <span>
                    <MapPin size={15} /> {company.address.join(", ")}
                  </span>
                </div>
              </div>
              <a className="btn btn--ghost btn--sm lg-official" href={d.official} target="_blank" rel="noreferrer">
                Read the full official version <ExternalLink size={14} />
              </a>
            </section>
          </article>
        </div>
      </main>

      <Footer home={false} />
    </>
  );
}
