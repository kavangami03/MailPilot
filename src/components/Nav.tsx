import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { Logo } from "./Logo";
import { links, nav, platforms } from "../data/content";
import { getLenis } from "../lib/motion";
import { PlatformIcon } from "./ui";
import "./Nav.css";

export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const linksRef = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const header = useRef<HTMLElement>(null);

  // Hide on scroll down, show on scroll up; scrollspy for the sliding highlight.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const sections = nav.map((n) => document.querySelector<HTMLElement>(n.href));
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (y > 480 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y < 480) setHidden(false);
      last = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.current?.style.setProperty("--p", String(max > 0 ? Math.min(1, y / max) : 0));
      const probe = window.innerHeight * 0.4;
      let idx = -1;
      sections.forEach((s, i) => {
        if (s && s.getBoundingClientRect().top < probe) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Slide the highlight pill under the active link.
  useEffect(() => {
    const ind = indicator.current;
    const host = linksRef.current;
    if (!ind || !host) return;
    const a = host.querySelectorAll<HTMLAnchorElement>("a")[active];
    if (!a) {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.width = `${a.offsetWidth}px`;
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
  }, [active]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav ${hidden && !open ? "is-hidden" : ""} ${open ? "is-open" : ""}`} ref={header}>
      <div className="nav__pill">
        <Logo className="nav__logo" />
        <nav className="nav__links" aria-label="Primary" ref={linksRef}>
          <span className="nav__indicator" ref={indicator} aria-hidden="true" />
          {nav.map((item, i) => (
            <a key={item.href} href={item.href} className={i === active ? "is-active" : ""} aria-current={i === active ? "true" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <a className="nav__login" href={links.login}>
            Sign in
          </a>
          <a className="nav__cta" href={links.signup}>
            Start free <ArrowUpRight size={16} />
          </a>
          <button
            className="nav__burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="burger" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
        <span className="nav__progress" aria-hidden="true" />
      </div>

      <div className="nav__sheet" id="mobile-menu" aria-hidden={!open} inert={!open}>
        <p className="nav__sheet-kicker">where to?</p>
        <ul>
          {nav.map((item, i) => (
            <li key={item.href} style={{ ["--i" as string]: i }}>
              <a href={item.href} onClick={() => setOpen(false)}>
                <span>0{i + 1}</span>
                {item.label}
                <ArrowUpRight size={22} className="nav__sheet-arrow" />
              </a>
            </li>
          ))}
        </ul>
        <div className="nav__sheet-foot">
          <div className="nav__sheet-cta">
            <a className="btn btn--bronze btn--arrow" href={links.signup}>
              Start with MailPilot free
              <span className="btn__arrow" aria-hidden="true">
                <ArrowUpRight size={18} />
              </span>
            </a>
            <a className="btn btn--ghost" href={links.login}>
              Sign in
            </a>
          </div>
          <p className="nav__sheet-meta">
            <a href={links.email}>
              <Mail size={15} /> hello@supermia.ai
            </a>
            <span className="nav__sheet-icons" aria-label="Works with Gmail and Outlook">
              {platforms.map((p) => (
                <PlatformIcon key={p.name} name={p.name} size={16} />
              ))}
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
