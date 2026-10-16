import { ArrowUp, ArrowUpRight, EyeOff, Lock, Mail, MapPin, ShieldCheck } from "lucide-react";
import { links, nav, office, platforms } from "../data/content";
import { getLenis } from "../lib/motion";
import { PlatformIcon } from "./ui";
import "./Footer.css";

/** `home` = rendered on the landing page; elsewhere, section links point back to it. */
export function Footer({ home = true }: { home?: boolean }) {
  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="foot">
      <div className="foot__env">
        <div className="foot__flap" aria-hidden="true" />
        <button className="foot__seal" onClick={toTop} aria-label="Back to top">
          <img src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
          <span>
            <ArrowUp size={14} /> top
          </span>
        </button>
        <p className="foot__sealed" aria-hidden="true">
          sealed &amp; sent
        </p>
      </div>

      <div className="shell foot__inner">
        <div className="foot__top">
          <div className="foot__brand">
            <img className="foot__logo" src="/mailpilot-logo-light.png" alt="MailPilot" width={1536} height={313} loading="lazy" />
            <p className="foot__tagline">
              Write the reply, chase the follow-up, <span>keep the relationship.</span>
            </p>
            <div className="foot__ctas">
              <a className="btn btn--bronze btn--sm" href={links.signup}>
                Start free <ArrowUpRight size={16} />
              </a>
              <a className="btn btn--ghost btn--sm" href={links.brochure}>
                Brochure (PDF)
              </a>
            </div>
          </div>

          <nav className="foot__col" aria-label="Product">
            <p>Product</p>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={home ? n.href : `/${n.href}`}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="foot__col" aria-label="Account">
            <p>Account</p>
            <ul>
              <li>
                <a href={links.signup}>Start free</a>
              </li>
              <li>
                <a href={links.login}>Sign in</a>
              </li>
              <li>
                <a href={links.demo}>Book a demo</a>
              </li>
              <li>
                <a href={links.product}>MailPilot on SuperMIA</a>
              </li>
            </ul>
          </nav>
          <div className="foot__col">
            <p>Works with</p>
            <ul>
              {platforms.map((p) => (
                <li key={p.name} className="foot__platform">
                  <PlatformIcon name={p.name} size={17} />
                  {p.name}
                </li>
              ))}
            </ul>
          </div>

          <address className="foot__office">
            <p>Office</p>
            <a href={links.directions} target="_blank" rel="noreferrer" className="foot__addr">
              <MapPin size={15} />
              <span>
                {office.line1}
              <br />
                {office.line2}
                <em>Get directions →</em>
              </span>
            </a>
            <a href={links.email} className="foot__mail">
              <Mail size={15} /> {office.email}
            </a>
          </address>
        </div>

        <div className="foot__trust" role="group" aria-label="Security and compliance">
          <div className="casa">
            <span className="casa__seal" aria-hidden="true">
              <ShieldCheck size={24} strokeWidth={1.9} />
            </span>
            <span className="casa__text">
              <strong>CASA certified</strong>
              <em>Cloud Application Security Assessment, the independent review Google requires for Gmail apps</em>
            </span>
          </div>
          <ul className="foot__facts">
            <li>
              <Lock size={15} /> Data encrypted with AES-256
            </li>
            <li>
              <EyeOff size={15} /> Gmail data never used for ads or to train general AI models
            </li>
          </ul>
        </div>

        <div className="foot__bottom">
          <span className="foot__copy">
            <span>© 2026 MailPilot AI. All rights reserved.</span>
            <span className="foot__credit">
              Designed &amp; developed by{" "}
              <a href={links.softqube} target="_blank" rel="noopener">
                Softqube Technologies
              </a>
            </span>
          </span>
          <span className="foot__legal">
            <a href={links.privacy}>Privacy Policy</a>
            <a href={links.terms}>Terms &amp; Conditions</a>
            <span>
              by{" "}
              <a href={links.supermia} className="foot__strong" target="_blank" rel="noreferrer">
                SuperMIA
              </a>{" "}
              · <a href={links.botfinity} target="_blank" rel="noreferrer">
                Botfinity Inc.
              </a>
            </span>
          </span>
        </div>
      </div>

      <div className="foot__word" aria-hidden="true">
        MailPilot
      </div>
    </footer>
  );
}
