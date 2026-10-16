import { useState } from "react";
import { Check, Clock, CornerUpLeft, Pause, PenLine, Sparkles, StickyNote } from "lucide-react";
import { contacts, countWords, drafts, type FeatureVisual, type Tone } from "../data/content";
import { Avatar } from "./ui";
import "./FeatureVisuals.css";

const tones: { id: Tone; label: string }[] = [
  { id: "executive", label: "Executive" },
  { id: "warm", label: "Warm" },
  { id: "concise", label: "Concise" },
];

function Voice() {
  const [tone, setTone] = useState<Tone>("warm");
  const d = drafts[tone];
  return (
    <div className="ui fv">
      <div className="fv__head">
        <strong>Reply to Maya Chen</strong>
        <span className="chip chip--bronze">
          <Sparkles size={11} /> 96% match
        </span>
      </div>
      <div className="fv-seg" role="radiogroup" aria-label="Draft tone">
        {tones.map((t) => (
          <button key={t.id} role="radio" aria-checked={tone === t.id} className={tone === t.id ? "is-on" : ""} onClick={() => setTone(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <p className="fv-voice__draft" key={tone} aria-live="polite">
        {d.text}
      </p>
      <div className="fv__foot">
        <span className="chip">{countWords(d.text)} words</span>
        <span className="fv__wait">
          <CornerUpLeft size={13} /> Waiting for your review
        </span>
      </div>
    </div>
  );
}

function Relationships() {
  const rows = [...contacts].sort((a, b) => a.score - b.score).slice(0, 4);
  const focus = rows[0];
  return (
    <div className="ui fv">
      <div className="fv__head">
        <strong>Relationships</strong>
        <span className="fv__meta">142 tracked · 4 cooling</span>
      </div>
      <ul className="fv-rel">
        {rows.map((c) => (
          <li key={c.id} className={c.id === focus.id ? "is-focus" : ""}>
            <Avatar name={c.id} initials={c.initials} tone={c.status === "cooling" ? "bronze" : "teal"} />
            <span className="fv-rel__who">
              <strong>{c.name}</strong>
              <em>
                {c.days}d since last reply
              </em>
            </span>
            <span className="fv-rel__score">
              <span className="fv-bar">
                <i className={c.status === "cooling" ? "is-cool" : ""} style={{ transform: `scaleX(${c.score / 100})` }} />
              </span>
              <b>{c.score}</b>
            </span>
          </li>
        ))}
      </ul>
      <p className="fv-rel__next">
        <span>Next move · {focus.name}</span>
        {focus.next}
      </p>
    </div>
  );
}

const followSteps = [
  { when: "Mon 10:14", title: "Proposal sent to Jon Bell", state: "done" },
  { when: "Thu 10:14", title: "No reply after 3 days", state: "done" },
  { when: "Thu 10:15", title: "Follow-up drafted from the thread", state: "active" },
  { when: "Fri 09:00", title: "Sends, or waits for your approval", state: "next" },
];

function FollowUps() {
  return (
    <div className="ui fv">
      <div className="fv__head">
        <strong>Proposal · Studio Vale</strong>
        <span className="chip">
          <span className="dot" /> Sequence active
        </span>
      </div>
      <div className="fv-rules">
        <span className="chip chip--ghost">
          <Clock size={11} /> Wait 3 days
        </span>
        <span className="chip chip--ghost">Max 2</span>
        <span className="chip chip--ghost">Stop on reply</span>
        <span className="chip chip--ghost">
          <Pause size={11} /> Pause anytime
        </span>
      </div>
      <ol className="fv-steps">
        {followSteps.map((s) => (
          <li key={s.title} className={`is-${s.state}`}>
            <span className="fv-steps__node">{s.state === "done" && <Check size={11} />}</span>
            <div>
              <em>{s.when}</em>
              <p>{s.title}</p>
              {s.state === "active" && <blockquote>“Hi Jon, circling back on the proposal. Would a 20-minute call Thursday help us agree the next step?”</blockquote>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const bars = [34, 52, 44, 61, 48, 70, 58, 66, 74, 62, 80, 72, 86, 78];

function Overview() {
  return (
    <div className="ui fv">
      <div className="fv__head">
        <strong>Inbox Performance Overview</strong>
        <span className="fv__meta">Last 14 days</span>
      </div>
      <dl className="fv-kpis">
        <div>
          <dt>Avg. response</dt>
          <dd>1h 12m</dd>
        </div>
        <div>
          <dt>Reply rate</dt>
          <dd>68%</dd>
        </div>
        <div>
          <dt>Open threads</dt>
          <dd>6</dd>
        </div>
      </dl>
      <div className="fv-chart" aria-hidden="true">
        {bars.map((h, i) => (
          <i key={i} style={{ transform: `scaleY(${h / 100})` }} />
        ))}
      </div>
      <p className="fv-waiting">
        <span>Waiting on you</span>
        <Avatar name="dev" initials="DR" tone="bronze" /> Dev Raman <em>· 2 days</em>
      </p>
    </div>
  );
}

function Instructions() {
  return (
    <div className="ui fv fv-note">
      <div className="fv__head">
        <strong>
          <StickyNote size={14} /> Thread note
        </strong>
        <span className="fv__meta">Re: Q3 proposal</span>
      </div>
      <ul className="fv-note__lines">
        <li>Keep it under 80 words.</li>
        <li>Confirm Thursday, 2pm.</li>
        <li>Always copy Jon on pricing.</li>
      </ul>
      <div className="fv__foot">
        <span className="chip">
          <PenLine size={11} /> This thread only
        </span>
        <span className="fv__ok">
          <Check size={13} /> Followed in the draft
        </span>
      </div>
    </div>
  );
}

export function FeatureVisualCard({ kind }: { kind: FeatureVisual }) {
  if (kind === "voice") return <Voice />;
  if (kind === "relationships") return <Relationships />;
  if (kind === "followups") return <FollowUps />;
  if (kind === "overview") return <Overview />;
  return <Instructions />;
}
