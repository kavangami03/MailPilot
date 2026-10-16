import { useRef } from "react";
import { Check, Mail } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";
import { Photo } from "./ui";
import "./DayStrip.css";

const DAY = 540; // a 9-hour day in minutes, 9am → 6pm
const at = (m: number) => `${(m / DAY) * 100}%`;
const HOURS = ["9am", "10", "11", "12pm", "1", "2", "3", "4", "5", "6pm"];

type Block = { s: number; d: number; t: string; review?: boolean };

// a normal Tuesday: seven email interruptions that add up to 186 minutes, 3.1 hours
const CHORES: Block[] = [
  { s: 0, d: 40, t: "Triage the inbox" },
  { s: 75, d: 25, t: "Reply to Maya" },
  { s: 150, d: 18, t: "Chase Jon" },
  { s: 240, d: 35, t: "Re-read the Finance thread" },
  { s: 310, d: 18, t: "Follow up Lena" },
  { s: 380, d: 25, t: "Fix the tone on a client email" },
  { s: 455, d: 25, t: "Catch up on everything else" },
];
// the same Tuesday with MailPilot: one review, then real work
const CALM: Block[] = [
  { s: 0, d: 14, t: "Review", review: true },
  { s: 25, d: 125, t: "Deep work" },
  { s: 180, d: 55, t: "Lunch" },
  { s: 250, d: 100, t: "Client calls" },
  { s: 370, d: 110, t: "Strategy" },
];
// the emails that kept interrupting it (decorative, piled over the photo)
const PINGS = [
  { from: "Maya Chen", subj: "Re: Launch notes", time: "10:15", top: "9%", right: "3%", tilt: "-3deg" },
  { from: "Jon Bell", subj: "Proposal: any thoughts?", time: "11:30", top: "45%", right: "9%", tilt: "2deg" },
  { from: "Finance", subj: "Q3 numbers (14 replies)", time: "1:00", top: "56%", right: "10%", tilt: "-1.5deg" },
  { from: "Lena Okafor", subj: "Any update on the samples?", time: "2:10", top: "67%", right: "3%", tilt: "2.5deg" },
];

function DayBar({ blocks, kind }: { blocks: Block[]; kind: "mail" | "calm" }) {
  return (
    <div className={`tbar tbar--${kind}`}>
      <div className="tbar__track">
        {blocks.map((b) => (
          <span
            key={b.t}
            className={`tbar__b ${b.review ? "is-review" : ""} ${b.d < 105 ? "is-short" : ""}`}
            style={{ left: at(b.s), width: at(b.d) }}
            title={b.t}
          >
            {kind === "mail" ? <Mail size={11} /> : !b.review && <em>{b.t}</em>}
          </span>
        ))}
      </div>
      <div className="tbar__hours" aria-hidden="true">
        {HOURS.map((h, i) => (
          <span key={h} style={{ left: at(i * 60) }}>
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DayStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const num = q(".tday__num")[0] as HTMLElement;
      const o = { v: 0 };
      const wipe = window.matchMedia("(max-width: 860px)").matches ? "inset(0% 0% 100% 0%)" : "inset(0% 100% 0% 0%)";
      // plays in about 1.5 seconds; the right side starts opening half a second in, so it is never empty for long
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: q(".tues")[0], start: "top 82%", once: true },
        })
        // the Tuesday without MailPilot: interruptions pile up and the hours count up
        .from(q(".tday--before .photo img"), { scale: 1.1, duration: 1.4, ease: "power2.out" }, 0)
        .from(q(".tday--before .tday__head"), { y: 16, autoAlpha: 0, duration: 0.45 }, 0.05)
        .from(
          q(".ping"),
          { y: 20, scale: 0.94, autoAlpha: 0, duration: 0.4, ease: "back.out(1.8)", stagger: 0.08 },
          0.1,
        )
        .to(o, { v: 3.1, duration: 0.7, ease: "power2.out", onUpdate: () => (num.textContent = o.v.toFixed(1)) }, 0.1)
        .from(
          q(".tday--before .tday__stat, .tday--before .tbar"),
          { y: 16, autoAlpha: 0, duration: 0.45, stagger: 0.06 },
          0.15,
        )
        .from(q(".tday--before .tbar__b"), { scaleX: 0, duration: 0.35, stagger: 0.04 }, 0.25)
        // MailPilot seals it, and the same Tuesday opens up beside it
        .from(q(".tues__seam i"), { scaleY: 0, duration: 0.45, ease: "power2.inOut" }, 0.35)
        .from(q(".tues__seal"), { scale: 1.8, rotate: -40, autoAlpha: 0, duration: 0.4, ease: "back.out(2.2)" }, 0.45)
        .fromTo(
          q(".tday--after")[0],
          { clipPath: wipe },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65, ease: "power3.inOut" },
          0.5,
        )
        .from(q(".tday--after .photo img"), { scale: 1.1, duration: 1.4, ease: "power2.out" }, 0.5)
        .from(
          q(".tday--after .tday__head, .tday--after .chipx, .tday--after .tday__stat, .tday--after .tbar"),
          { y: 16, autoAlpha: 0, duration: 0.45, stagger: 0.06 },
          0.75,
        )
        .from(q(".tday--after .tbar__b"), { scaleX: 0, duration: 0.35, stagger: 0.05 }, 0.9)
        .from(q(".tday__note"), { clipPath: "inset(-40% 100% -40% 0%)", duration: 0.45, ease: "power2.inOut" }, 1.05);
    },
    { scope: root },
  );

  return (
    <section className="day section" id="problem" ref={root}>
      <div className="shell">
        <header className="section-head section-head--split">
          <div>
            <p className="eyebrow">The problem</p>
            <h2 className="h2" data-split>
              Email quietly takes a third of your <span className="script">working day.</span>
            </h2>
          </div>
          <p className="lead" data-reveal>
            Not in one block, but in small interruptions from the first coffee to the last train home. Here is the same
            Tuesday, twice.
          </p>
        </header>

        <div className="tues">
          <article className="tday tday--before">
            <div className="tday__photo">
              <Photo name="day-before" alt="A professional still at their desk at 6:40 pm, working through email" />
            </div>
            <div className="tday__head">
              <p className="tday__label">Tuesday · without MailPilot</p>
              <p className="tday__time">6:40 pm</p>
            </div>
            <div className="pings" aria-hidden="true">
              {PINGS.map((p) => (
                <div className="ping" key={p.subj} style={{ top: p.top, right: p.right }}>
                  <div className="ping__in" style={{ rotate: p.tilt }}>
                    <span className="ping__icon">
                      <Mail size={13} />
                    </span>
                    <span className="ping__text">
                      <strong>{p.from}</strong>
                      <em>{p.subj}</em>
                    </span>
                    <time>{p.time}</time>
                  </div>
                </div>
              ))}
            </div>
            <div className="tday__foot">
              <p className="tday__stat">
                <b>
                  <span className="tday__num">3.1</span>
                  <small>hrs</small>
                </b>
                <span>on email, in seven interruptions</span>
              </p>
              <DayBar blocks={CHORES} kind="mail" />
            </div>
          </article>

          <article className="tday tday--after">
            <div className="tday__photo">
              <Photo name="day-after" alt="The same professional leaving the office at 5:45 pm, coffee in hand" />
            </div>
            <div className="tday__head">
              <p className="tday__label">Tuesday · with MailPilot</p>
              <p className="tday__time">5:45 pm</p>
            </div>
            <div className="chips" aria-hidden="true">
              <span className="chipx">
                <Check size={13} strokeWidth={3} /> Drafts approved · 9:00
              </span>
              <span className="chipx">
                <Check size={13} strokeWidth={3} /> Follow-ups sent for you
              </span>
              <span className="tday__note">home by six ✓</span>
            </div>
            <div className="tday__foot">
              <p className="tday__stat">
                <b>
                  <span>1</span>
                  <small>review</small>
                </b>
                <span>then the rest of the day is yours</span>
              </p>
              <DayBar blocks={CALM} kind="calm" />
            </div>
          </article>

          <div className="tues__seam" aria-hidden="true">
            <i />
            <span className="tues__seal">
              <img src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
