import { useRef } from "react";
import { Mail } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "../lib/motion";
import { Photo } from "./ui";
import "./DayStrip.css";

const hours = ["9", "10", "11", "12", "1", "2", "3", "4", "5"];

// Red-ink email chores, written into the diary (row = hour index, col = horizontal offset %)
const chores = [
  { row: 0, col: 0, text: "triage the inbox (again)" },
  { row: 1, col: 30, text: "reply to Maya — launch notes" },
  { row: 2, col: 8, text: "chase Jon re: proposal ??" },
  { row: 4, col: 40, text: "re-read the Finance thread" },
  { row: 5, col: 4, text: "follow up Lena!!" },
  { row: 6, col: 34, text: "fix the tone on client email" },
  { row: 8, col: 10, text: "catch up on everything else" },
];
// Calm teal entries once MailPilot takes the email work
const calm = [
  { row: 1, col: 4, text: "Deep work — Q4 plan" },
  { row: 3, col: 26, text: "Lunch with Priya" },
  { row: 5, col: 36, text: "Client calls" },
  { row: 7, col: 6, text: "Strategy session" },
  { row: 8, col: 48, text: "Home by six ✓" },
];

const R = 80;
const C = 2 * Math.PI * R;
const EMAIL_SHARE = 3.1 / 9; // 3.1 hrs of a 9-hour day

export function DayStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const num = q(".dial__num")[0] as HTMLElement;
      if (prefersReducedMotion()) {
        root.current!.classList.add("is-after");
        return;
      }
      const o = { v: 0 };
      gsap.set(q(".dial__mail"), { strokeDasharray: `0 ${C}` });
      gsap.set(q(".dial__free"), { strokeDasharray: `0 ${C}` });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q(".day__pin")[0],
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
        },
      });
      // Phase A — the day fills with email
      tl.from(
        q(".chore"),
        {
          clipPath: "inset(-30% 100% -30% 0%)",
          stagger: 0.16,
          duration: 0.25,
          ease: "power1.inOut",
        },
        0,
      )
        .to(
          q(".dial__mail"),
          {
            strokeDasharray: `${C * EMAIL_SHARE} ${C}`,
            duration: 1.2,
            ease: "power1.inOut",
          },
          0,
        )
        .to(
          o,
          {
            v: 3.1,
            duration: 1.2,
            onUpdate: () => (num.textContent = o.v.toFixed(1)),
          },
          0,
        )
        .to({}, { duration: 0.2 })
        // Phase B — MailPilot takes it
        .addLabel("b")
        .fromTo(q(".chore .strike"), { clipPath: "inset(-50% 100% -50% 0%)" }, { clipPath: "inset(-50% 0% -50% 0%)", stagger: 0.08, duration: 0.18 }, "b")
        .to(q(".chore"), { color: "rgba(165,69,46,0.3)", duration: 0.3, stagger: 0.05 }, "b+=0.25")
        .fromTo(
          q(".rubber"),
          { autoAlpha: 0, scale: 2.2, rotate: -30 },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: -12,
            duration: 0.18,
            ease: "back.out(2)",
          },
          "b+=0.55",
        )
        .to(
          q(".dial__mail"),
          {
            strokeDasharray: `${C * 0.035} ${C}`,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "b+=0.3",
        )
        .to(
          q(".dial__free"),
          {
            strokeDasharray: `${C * (1 - 0.035)} ${C}`,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "b+=0.45",
        )
        .to(q(".dial__state--before"), { autoAlpha: 0, duration: 0.15 }, "b+=0.4")
        .fromTo(q(".dial__state--after"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2 }, "b+=0.55")
        .fromTo(
          q(".calm"),
          { clipPath: "inset(-30% 100% -30% 0%)" },
          {
            clipPath: "inset(-30% 0% -30% 0%)",
            stagger: 0.12,
            duration: 0.22,
            ease: "power1.inOut",
          },
          "b+=0.7",
        )
        .to(q(".day__cap--before"), { autoAlpha: 0, duration: 0.15 }, "b+=0.4")
        .fromTo(
          q(".snap__after"),
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power2.inOut" },
          "b+=0.35",
        )
        .to(q(".snap__cap--before"), { autoAlpha: 0, duration: 0.12 }, "b+=0.45")
        .fromTo(q(".snap__cap--after"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, "b+=0.6")
        .fromTo(q(".snap"), { rotate: -5 }, { rotate: 4, duration: 0.6, ease: "power1.inOut" }, "b+=0.3")
        .fromTo(q(".day__cap--after"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, "b+=0.55")
        .to({}, { duration: 0.35 });
    },
    { scope: root },
  );

  return (
    <section className="day" id="problem" ref={root}>
      <div className="day__pin shell">
        <div className="day__side">
          <p className="eyebrow">The problem</p>
          <h2 className="h2" data-split>
            Email quietly takes a third of your <span className="script">working day.</span>
          </h2>

          <div className="day__visual">
            <div
              className="dial"
              role="img"
              aria-label="Of a 9-hour working day, about 3.1 hours go to email. With MailPilot that shrinks to one review, and the rest of the day comes back."
            >
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={R} className="dial__track" />
                {Array.from({ length: 9 }, (_, i) => {
                  const a = (i / 9) * 2 * Math.PI - Math.PI / 2;
                  return (
                    <line
                      key={i}
                      x1={100 + Math.cos(a) * 92}
                      y1={100 + Math.sin(a) * 92}
                      x2={100 + Math.cos(a) * 98}
                      y2={100 + Math.sin(a) * 98}
                      className="dial__tick"
                    />
                  );
                })}
                <circle
                  cx="100"
                  cy="100"
                  r={R}
                  className="dial__free"
                  transform={`rotate(${-90 + 360 * 0.035} 100 100)`}
                />
                <circle cx="100" cy="100" r={R} className="dial__mail" transform="rotate(-90 100 100)" />
              </svg>
              <div className="dial__center">
                <p className="dial__state dial__state--before">
                  <b>
                    <span className="dial__num">3.1</span>
                    <small>hrs</small>
                  </b>
                  <span>of every 9-hour day, on email</span>
                </p>
                <p className="dial__state dial__state--after">
                  <span className="script">your day,</span>
                  <b className="dial__back">back.</b>
                </p>
              </div>
              <ul className="dial__legend">
                <li>
                  <i className="is-mail" /> Email
                </li>
                <li>
                  <i className="is-free" /> Your work
                </li>
              </ul>
            </div>
            <figure className="snap" aria-hidden="true">
              <span className="snap__tape" />
              <div className="snap__img">
                <Photo name="day-before" alt="" />
                <Photo name="day-after" alt="" className="snap__after" />
              </div>
              <figcaption>
                <span className="snap__cap snap__cap--before">6:40 pm, still on email</span>
                <span className="snap__cap snap__cap--after">5:45 pm, done for the day</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="diary">
          <div className="diary__rings" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <header className="diary__head">
            <span className="diary__day">Tuesday</span>
            <span className="diary__meta">
              14 October
              <em>Day planner</em>
            </span>
          </header>
          <div className="diary__page" aria-hidden="true">
            {hours.map((h, i) => (
              <div className="diary__row" key={h}>
                <span className="diary__hour">
                  {h}
                  <small>{i < 3 ? "am" : "pm"}</small>
                </span>
              </div>
            ))}
            {chores.map((c) => (
              <p
                className="chore"
                key={c.text}
                style={{
                  ["--row" as string]: c.row,
                  ["--col" as string]: `${c.col}%`,
                }}
              >
                <Mail size={14} />
                {c.text}
                <svg className="strike" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 6 C 30 3, 70 8, 100 4" />
                </svg>
              </p>
            ))}
            {calm.map((c) => (
              <p
                className="calm"
                key={c.text}
                style={{
                  ["--row" as string]: c.row,
                  ["--col" as string]: `${c.col}%`,
                }}
              >
                {c.text}
              </p>
            ))}
            <div className="rubber">
              <span>Handled by</span>
              <b>MailPilot</b>
              <span>review once · 9:00</span>
            </div>
          </div>
          <div className="day__caps">
            <p className="day__cap day__cap--before">
              <b>Without MailPilot:</b> triage, rereads, rewrites and chasing, scattered through every hour.
            </p>
            <p className="day__cap day__cap--after">
              <b>With MailPilot:</b> replies arrive drafted, follow-ups run themselves, you review once.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
