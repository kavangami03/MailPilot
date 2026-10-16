import { useRef } from "react";
import { Mail } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";
import { Photo } from "./ui";
import "./DayStrip.css";

const DAY = 540; // a 9-hour day in minutes, 9am → 6pm
const hours = ["9", "10", "11", "12", "1", "2", "3", "4", "5", "6"];

// Email work scattered through the day (start = minutes after 9:00). Adds up to 186 min: 3.1 hrs.
const chores = [
  { s: 0, d: 40, t: "Triage the inbox", k: "Triage" },
  { s: 75, d: 25, t: "Reply to Maya", k: "Reply to Maya" },
  { s: 150, d: 18, t: "Chase Jon re: proposal", k: "Chase Jon" },
  { s: 240, d: 35, t: "Re-read the Finance thread", k: "Finance thread" },
  { s: 310, d: 18, t: "Follow up Lena", k: "Follow up Lena" },
  { s: 380, d: 25, t: "Fix the tone on a client email", k: "Fix the tone" },
  { s: 455, d: 25, t: "Catch up on everything else", k: "Catch up" },
];
// The same day with MailPilot: one review, then real work
const calm = [
  { s: 0, d: 12, t: "Review drafts, once", review: true },
  { s: 25, d: 125, t: "Deep work · Q4 plan" },
  { s: 180, d: 55, t: "Lunch with Priya" },
  { s: 250, d: 100, t: "Client calls" },
  { s: 370, d: 110, t: "Strategy session" },
];

const clock = (m: number) => {
  const h = 9 + Math.floor(m / 60);
  return `${h > 12 ? h - 12 : h}:${String(m % 60).padStart(2, "0")}`;
};
const vars = (s: number, d: number, lane = 0) => ({ ["--s" as string]: s, ["--d" as string]: d, ["--lane" as string]: lane });

export function DayStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        root.current!.classList.add("is-after");
        return;
      }
      const mm = gsap.matchMedia();
      mm.add({ any: "(min-width: 1px)", desktop: "(min-width: 1061px) and (min-height: 640px)", vertical: "(max-width: 860px)" }, (ctx) => {
        const { desktop, vertical } = ctx.conditions as { desktop: boolean; vertical: boolean };
        const num = q(".day__num")[0] as HTMLElement;
        const o = { v: 0 };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: desktop
            ? { trigger: q(".day__pin")[0], start: "top top", end: "+=190%", pin: true, scrub: 0.6 }
            : { trigger: q(".ribbon")[0], start: "top 85%", end: "bottom 35%", scrub: 0.6 },
        });

        // ---- Phase A: the day fills with email ----
        tl.from(q(".ribbon__track"), { clipPath: vertical ? "inset(0% 0% 100% 0% round 18px)" : "inset(0% 100% 0% 0% round 18px)", duration: 0.45, ease: "power2.inOut" }, 0).from(
          q(".ribbon__ticks span"),
          { autoAlpha: 0, duration: 0.2, stagger: 0.03 },
          0.15,
        );
        chores.forEach((_, i) => {
          const at = 0.45 + i * 0.16;
          tl.from(q(".rb--mail")[i], { autoAlpha: 0, scale: 0.5, x: vertical ? 30 : 0, y: vertical ? 0 : -40, duration: 0.2, ease: "back.out(2)" }, at);
          tl.from(q(".tag--mail")[i], { autoAlpha: 0, y: 12, duration: 0.2, ease: "power2.out" }, at + 0.08);
        });
        tl.to(o, { v: 3.1, duration: 0.45 + chores.length * 0.16, onUpdate: () => (num.textContent = o.v.toFixed(1)) }, 0.2)
          .to({}, { duration: 0.35 })

          // ---- Phase B: MailPilot sweeps the day; email collapses, real work grows in its place ----
          .addLabel("b")
          .fromTo(q(".ribbon__scan"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, "b")
          .fromTo(q(".ribbon__track"), { "--scan": 0 }, { "--scan": 1, duration: 1.3 }, "b");
        const sweep = (m: number) => `b+=${(m / DAY) * 1.3}`;
        chores.forEach((c, i) => {
          tl.to(q(".rb--mail")[i], { autoAlpha: 0, scale: 0.3, duration: 0.12, ease: "power2.in" }, sweep(c.s)).to(
            q(".tag--mail")[i],
            { autoAlpha: 0, duration: 0.1 },
            sweep(c.s),
          );
        });
        calm.forEach((c, i) => {
          tl.fromTo(q(".rb--calm")[i], { "--g": 0 }, { "--g": 1, duration: (c.d / DAY) * 1.3 }, sweep(c.s));
        });
        tl.fromTo(q(".tag--calm"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.15, stagger: 1.15 }, "b+=0.05")
          .to(q(".ribbon__scan"), { autoAlpha: 0, duration: 0.1 }, "b+=1.3")
          .to(q(".day__count-before"), { autoAlpha: 0, y: -12, duration: 0.15 }, "b+=0.25")
          .fromTo(q(".day__count-after"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.2 }, "b+=0.4")
          .fromTo(q(".day__photo-after"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power2.inOut" }, vertical ? "b+=1" : "b+=0.2")
          .to(q(".day__stamp--before"), { autoAlpha: 0, duration: 0.1 }, vertical ? "b+=1.1" : "b+=0.3")
          .fromTo(q(".day__stamp--after"), { autoAlpha: 0, scale: 1.4 }, { autoAlpha: 1, scale: 1, duration: 0.18, ease: "back.out(2)" }, vertical ? "b+=1.35" : "b+=0.55")
          .to(q(".day__cap--before"), { autoAlpha: 0, duration: 0.12 }, "b+=0.5")
          .fromTo(q(".day__cap--after"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, "b+=0.62")
          .to({}, { duration: 0.35 });
      });
    },
    { scope: root },
  );

  return (
    <section className="day" id="problem" ref={root}>
      <div className="day__pin shell">
        <div className="day__top">
          <div className="day__copy">
            <p className="eyebrow">The problem</p>
            <h2 className="h2" data-split>
              Email quietly takes a third of your <span className="script">working day.</span>
            </h2>
            <p className="lead">
              Not in one block. In small interruptions, from the first coffee to the last train home. Here's a normal
              Tuesday.
            </p>
          </div>

          <figure className="day__figure">
            <div className="day__count">
              <p className="day__count-before">
                <b>
                  <span className="day__num">3.1</span>
                  <small>hrs</small>
                </b>
                <span>of every 9-hour day goes to email</span>
              </p>
              <p className="day__count-after">
                <span className="script">your day,</span>
                <b>back.</b>
              </p>
            </div>
            <div className="day__photo">
              <Photo name="day-before" alt="A professional still at their desk at 6:40 pm, working through email" />
              <Photo name="day-after" alt="The same professional leaving the office at 5:45 pm, coffee in hand" className="day__photo-after" />
              <span className="day__stamp day__stamp--before">6:40 pm · still on email</span>
              <span className="day__stamp day__stamp--after">5:45 pm · done for the day</span>
            </div>
          </figure>
        </div>

        <div
          className="ribbon"
          role="img"
          aria-label="A 9am to 6pm workday. Without MailPilot, seven email tasks scattered through the day add up to 3.1 hours. With MailPilot, one review at 9am, then deep work, lunch, client calls and a strategy session."
        >
          <div className="ribbon__ticks" aria-hidden="true">
            {hours.map((h, i) => (
              <span key={h} style={vars(i * 60, 0)}>
                {h}
                <small>{i < 3 ? "am" : "pm"}</small>
              </span>
            ))}
          </div>
          <div className="ribbon__track" aria-hidden="true">
            {chores.map((c) => (
              <span className="rb rb--mail" key={c.t} style={vars(c.s, c.d)}>
                <Mail size={14} />
                <span className="rb__label">{c.t}</span>
              </span>
            ))}
            {calm.map((c) => (
              <span className={`rb rb--calm ${c.review ? "rb--review" : ""}`} key={c.t} style={vars(c.s, c.d)}>
                <span className="rb__label">{c.t}</span>
              </span>
            ))}
            {chores.map((c, i) => (
              <p className={`tag tag--mail ${c.s / DAY > 0.75 ? "tag--end" : ""}`} key={c.t} style={vars(c.s, c.d, i % 2)}>
                <time>{clock(c.s)}</time>
                <span className="tag__full">{c.t}</span>
                <span className="tag__short">{c.k}</span>
              </p>
            ))}
            <p className="tag tag--calm" style={vars(0, 12, 0)}>
              <time>9:00</time>
              <span>review once, approve, done</span>
            </p>
            <p className="tag tag--calm tag--end" style={vars(500, 40, 1)}>
              <time>6:00</time>
              <span>home by six ✓</span>
            </p>
            <span className="ribbon__scan">
              <i>
                <img src="/mailpilot-mark-light.png" alt="" width={391} height={313} />
              </i>
            </span>
          </div>
        </div>

        <div className="day__caps">
          <p className="day__cap day__cap--before">
            <b>Without MailPilot:</b> triage, rereads, rewrites and chasing, scattered through every hour.
          </p>
          <p className="day__cap day__cap--after">
            <b>With MailPilot:</b> replies arrive drafted, follow-ups run themselves, and you review once.
          </p>
        </div>
      </div>
    </section>
  );
}
