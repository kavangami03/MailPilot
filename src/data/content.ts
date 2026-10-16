// Product facts mirror https://supermia.ai/ai-mailpilot/ and the MailPilot brochure.
// Names inside product mock-ups (Maya, Jon, Priya…) are illustrative sample data.

export const links = {
  signup: "https://mia.supermia.ai/signup",
  login: "https://mailpilot.supermia.ai/",
  demo: "https://supermia.ai/schedule-demo/",
  brochure: "/brochure/mailpilot-brochure.pdf",
  product: "https://supermia.ai/ai-mailpilot/",
  supermia: "https://supermia.ai/",
  botfinity: "https://botfinity.ai/",
  privacy: "/privacy/",
  terms: "/terms/",
  email: "mailto:hello@supermia.ai",
  directions:
    "https://www.google.com/maps/search/?api=1&query=2451%20W%20Grapevine%20Mills%20Cir%20%23547%2C%20Grapevine%2C%20TX%2076051",
};

export const nav = [
  { label: "Why MailPilot", href: "#problem" },
  { label: "See it work", href: "#demo" },
  { label: "Features", href: "#features" },
  { label: "Control", href: "#control" },
  { label: "FAQ", href: "#faq" },
];

export const platforms = [
  { name: "Gmail" },
  { name: "Google Workspace" },
  { name: "Outlook" },
  { name: "Office 365" },
];

export type Tone = "executive" | "warm" | "concise";

export const incomingEmail = {
  from: "Maya Chen",
  company: "Northstar",
  subject: "Launch notes: can you review before Thursday?",
  body: "Hi! Attaching the launch notes. Could you review the final copy before Thursday? Also, are we still on for the partner call, and who owns the pricing slide?",
};

/** Words in a draft, as the word-count chip shows it. */
export const countWords = (text: string) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

export const drafts: Record<Tone, { text: string; traits: Record<string, number> }> = {
  executive: {
    text: "Hi Maya, thanks for sending these. I'll review the final copy and return edits by Thursday at 2pm, priority items first. The partner call stands. Jon owns the pricing slide; I've copied him so he can confirm. Best, Alex",
    traits: { Formality: 86, Warmth: 48, Brevity: 72, Directness: 90 },
  },
  warm: {
    text: "Hi Maya, thank you for pulling this together. It reads beautifully already. I'll take a careful pass and have edits back to you by Thursday afternoon. Yes, still on for the partner call! Jon's got the pricing slide, I've looped him in. Talk soon, Alex",
    traits: { Formality: 44, Warmth: 94, Brevity: 52, Directness: 66 },
  },
  concise: {
    text: "Maya, edits back by Thu 2pm. Partner call: confirmed. Pricing slide: Jon (cc'd). Thanks, A",
    traits: { Formality: 58, Warmth: 30, Brevity: 98, Directness: 96 },
  },
};

export const contacts = [
  { id: "maya", name: "Maya Chen", role: "Product Lead · Northstar", initials: "MC", days: 2, score: 96, status: "healthy" as const, next: "Edits due Thursday 2pm. Draft is ready for you." },
  { id: "jon", name: "Jon Bell", role: "Partner · Studio Vale", initials: "JB", days: 18, score: 61, status: "cooling" as const, next: "Follow-up drafted: reopen the proposal with one clear next step." },
  { id: "priya", name: "Priya Shah", role: "Customer Success · Relay", initials: "PS", days: 1, score: 98, status: "healthy" as const, next: "No action needed. Thread pinned for Monday." },
  { id: "dev", name: "Dev Raman", role: "Founder · Arclight", initials: "DR", days: 26, score: 44, status: "cooling" as const, next: "Going cold. Suggested reason to reach out: their Series A news." },
  { id: "lena", name: "Lena Okafor", role: "VP Ops · Fieldwork", initials: "LO", days: 7, score: 88, status: "healthy" as const, next: "Follow-up scheduled for Friday if no reply." },
];

export const demoChapters = [
  { t: 0, label: "A new email lands", sub: "Maya needs three answers before Thursday" },
  { t: 4, label: "MailPilot reads the thread", sub: "Questions, deadlines and who owns what" },
  { t: 8, label: "Your Persona kicks in", sub: "Your tone, greeting and sign-off" },
  { t: 12, label: "The reply is drafted", sub: "All three questions answered" },
  { t: 16, label: "A follow-up is scheduled", sub: "Jon gets a nudge Friday if he stays quiet" },
  { t: 20, label: "You review. You send.", sub: "Nothing leaves without your say" },
];
export const DEMO_LENGTH = 24;

export type FeatureVisual = "voice" | "relationships" | "followups" | "overview" | "instructions";

export const features: { id: string; n: string; title: string; text: string; photo: string; alt: string; visual: FeatureVisual }[] = [
  {
    id: "voice",
    n: "01",
    title: "Replies that sound like you wrote them",
    text: "Set up your Persona once: formality, greetings, sign-offs, sentence rhythm and the phrases you always reach for. Every draft is written against it, so reviewing is a glance, not a rewrite.",
    photo: "persona-writer",
    alt: "A woman reading a printed letter in an armchair by the window",
    visual: "voice",
  },
  {
    id: "relationships",
    n: "02",
    title: "Know who's going cold before they do",
    text: "A profile for every contact, built straight from your inbox: history, frequency, last interaction and a relationship score. No CRM to update, nothing to type in.",
    photo: "client-coffee",
    alt: "A woman laughing with a client over coffee in a café",
    visual: "relationships",
  },
  {
    id: "follow-ups",
    n: "03",
    title: "Follow-ups that never slip through",
    text: "No reply inside your window? MailPilot drafts a follow-up from the original thread and your Persona. Approve each one, or let them go out on their own, with per-contact limits.",
    photo: "sales-call",
    alt: "A woman checking her phone as she walks down a sunlit city street",
    visual: "followups",
  },
  {
    id: "overview",
    n: "04",
    title: "Your whole inbox, at a glance",
    text: "The Inbox Performance Overview shows response times, reply rate, open threads, who's waiting on you and how your relationships are trending.",
    photo: "exec-review",
    alt: "A woman reviewing a tablet by an office window at dusk",
    visual: "overview",
  },
  {
    id: "instructions",
    n: "05",
    title: "Rules for the threads that matter",
    text: "Leave an instruction on any email or contact, like “keep it under 80 words” or “always copy Jon”, and MailPilot follows it for that conversation.",
    photo: "notes-instructions",
    alt: "A woman writing an instruction on a sticky note at her desk",
    visual: "instructions",
  },
];

export const steps = [
  {
    title: "Set up your Persona",
    eta: "10 to 15 min · once",
    text: "Describe how you write or paste a few sample emails. MailPilot learns your formality, greetings, sign-offs and the phrases you always reach for.",
    points: ["Describe your style in plain words", "Or paste a few sample emails", "Fine-tune the tone any time"],
  },
  {
    title: "Connect your inbox",
    eta: "2 to 3 min",
    text: "Link Gmail or Outlook. MailPilot reads your existing history to build relationship data, with no spreadsheets and no manual CRM entry.",
    points: ["Gmail & Google Workspace", "Outlook & Office 365", "Two-way sync from your own address"],
  },
  {
    title: "MailPilot manages",
    eta: "Automatic",
    text: "In the background it drafts replies, runs follow-up sequences and tracks the health of every relationship, while you do the work only you can do.",
    points: ["Replies drafted as email arrives", "Follow-ups scheduled and personalised", "Cooling contacts flagged early"],
  },
  {
    title: "Review & send",
    eta: "Your review time",
    text: "Approve drafts and follow-ups, glance at your performance overview and hit send. Every email goes from your own address.",
    points: ["One click to approve, or edit first", "Draft or semi-automatic mode", "Pause any contact or thread"],
  },
];

export const crew = [
  {
    key: "sales",
    title: "Sales professionals",
    tag: "SDRs · AEs · Account managers · BDs",
    pain: "Your pipeline lives in the inbox. One slow reply and a warm prospect goes cold.",
    gets: ["Follow-ups that fire on schedule, every time", "Outreach and reply drafts that sound like you", "More hours for calls and demos"],
    photo: "crew-sales",
    alt: "A smiling sales professional in a denim jacket on a busy sales floor",
    initials: "SDR",
  },
  {
    key: "exec",
    title: "Executives & founders",
    tag: "CEOs · Founders · Partners · Directors",
    pain: "Your time is the most expensive in the company, and the inbox quietly eats about three hours of it a day.",
    gets: ["Replies drafted before you open the thread", "Follow-ups managed without a reminder", "Only what truly needs you rises to the top"],
    photo: "crew-exec",
    alt: "An executive in an ivory blazer in a corner office at dusk",
    initials: "CEO",
  },
  {
    key: "consult",
    title: "Consultants & freelancers",
    tag: "Consultants · Agencies · Client services",
    pain: "Client relationships are the business. Neglect a high-value client by accident and the next project goes elsewhere.",
    gets: ["Every client relationship tracked and scored", "Polished, professional client drafts", "Proposals and follow-ups that never slip"],
    photo: "crew-consult",
    alt: "A consultant holding a coffee mug in a sunlit home studio",
    initials: "PRO",
  },
];

export const brochureChapters = [
  "Your AI co-pilot for every inbox",
  "The inbox overload problem",
  "Manage every email smarter",
  "About MailPilot",
  "The MailPilot story: from chaos to automation",
  "What makes MailPilot different",
  "The AI command dashboard",
  "Spend less time managing email",
];
export const brochurePages = brochureChapters.map((_, i) => `/brochure/page-${String(i + 1).padStart(2, "0")}.jpg`);

export const faqs = [
  {
    q: "When should I use MailPilot?",
    a: "MailPilot is an AI email assistant for Gmail and Outlook. If you spend more than 90 minutes a day on email, struggle to follow up consistently, or want every email you send to be sharper, MailPilot is built for you. It is especially valuable for sales teams, executives, consultants and anyone maintaining a large professional network.",
  },
  {
    q: "How does it learn my writing style?",
    a: "Through a one-time Persona setup. You describe your style or paste sample emails, and MailPilot captures your formality, greetings and sign-offs, sentence length, tone and recurring phrases. Every draft is written against that Persona.",
  },
  {
    q: "What does the Inbox Performance Overview show?",
    a: "Sent and received volume, average response time, reply rate, unanswered emails and how long they have waited, your top contacts, relationship scores and activity trends, all in one view.",
  },
  {
    q: "How does relationship intelligence work?",
    a: "MailPilot builds a profile for every contact from your existing email: communication history, frequency, last interaction, pending follow-ups and notes. A relationship score based on recency, frequency and response rate flags contacts that are cooling, with no separate data entry.",
  },
  {
    q: "How are follow-ups handled?",
    a: "If a reply doesn't arrive within the window you set, MailPilot schedules a follow-up draft personalised from the original email and your Persona. You can approve each one or let them send automatically. Per-contact frequency limits keep it from ever feeling pushy.",
  },
  {
    q: "How much control do I keep?",
    a: "All of it. In Draft mode nothing sends without your approval. In Semi-automatic mode follow-ups send on their own while reply drafts still wait for you. You can add instructions per email or per contact, and pause automation for any contact or thread.",
  },
  {
    q: "Which email platforms are supported?",
    a: "Gmail (Google Workspace and personal) and Outlook (Office 365 and Outlook.com), with two-way sync. Emails always send from your own address. More platforms are on the roadmap. Book a demo to confirm support for your environment.",
  },
  {
    q: "What does it cost?",
    a: "MailPilot uses 200 credits per month through the SuperMIA Agent Marketplace. New accounts receive free starter credits, so you can start without a credit card. Team and volume pricing is available on request.",
  },
];

export const office = {
  line1: "2451 W Grapevine Mills Cir #547",
  line2: "Grapevine, TX 76051",
  email: "hello@supermia.ai",
  website: "supermia.ai",
};
