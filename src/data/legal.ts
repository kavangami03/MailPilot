// Plain-language versions of the official SuperMIA legal documents (Botfinity Inc.).
// The binding texts live at supermia.ai/privacy-policy/ and supermia.ai/terms/ and win on any difference.

export type LegalDoc = "privacy" | "terms";

type Section = { id: string; title: string; body: string[]; list?: string[] };

type Doc = {
  title: string;
  script: string;
  updated: string;
  intro: string;
  official: string;
  highlights: { title: string; text: string }[];
  sections: Section[];
};

export const company = {
  name: "Botfinity Inc.",
  email: "hello@supermia.ai",
  phone: "+1 (512) 733-3085",
  phoneHref: "tel:+15127333085",
  address: ["2451 W Grapevine Mills Cir, Num 547", "Grapevine, TX 76051, USA"],
};

export const legal: Record<LegalDoc, Doc> = {
  privacy: {
    title: "Privacy Policy",
    script: "plainly put.",
    updated: "June 24, 2025",
    intro:
      "How Botfinity Inc., the company behind SuperMIA and MailPilot, collects, uses and protects your personal data, including the email data you choose to connect.",
    official: "https://supermia.ai/privacy-policy/",
    highlights: [
      { title: "Never used for ads", text: "Gmail data is used only for the automation you ask for. Never for advertising." },
      { title: "Never trains general AI", text: "Your Gmail data is not used to train generalised AI models." },
      { title: "Encrypted at rest", text: "Your data is protected with AES-256 encryption." },
      { title: "Gone when you leave", text: "Gmail tokens deleted within 24 hours of revoking access. Account data within 30 days." },
    ],
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        body: [
          "This policy explains how Botfinity Inc. (“we”, “us”) handles personal data when you use SuperMIA and its agents, including MailPilot. By using the services, you acknowledge the practices described here.",
        ],
      },
      {
        id: "data-we-collect",
        title: "Categories of personal data we collect",
        body: ["Depending on how you use the services, we may collect:"],
        list: [
          "Chat and voice input you provide, and the resulting transcripts",
          "Profile information, such as your name and contact details",
          "Usage and device data about how the services are accessed",
          "Gmail data, only when you choose to connect Gmail",
        ],
      },
      {
        id: "purposes",
        title: "Purposes of processing and legal basis",
        body: [
          "We process personal data to provide the services you request, keep them secure and reliable, support you, and meet our legal obligations. Each use relies on an appropriate legal basis, such as performing our agreement with you or your consent.",
        ],
      },
      {
        id: "google-limited-use",
        title: "Google API Limited Use compliance",
        body: [
          "Our use of information received from Google APIs follows the Google API Services User Data Policy, including its Limited Use requirements.",
        ],
      },
      {
        id: "ai-gmail",
        title: "AI processing of Gmail data",
        body: ["When you connect Gmail, MailPilot processes that data to draft replies and run the automation you ask for."],
        list: [
          "Used only for user-requested automation",
          "Not used for advertising",
          "Not used to train generalised AI models",
        ],
      },
      {
        id: "recipients",
        title: "Data recipients",
        body: [
          "We share personal data only where needed to run the services, for example with service providers who process it on our behalf, or where the law requires it.",
        ],
      },
      {
        id: "security",
        title: "Data security",
        body: ["We protect your data with AES-256 encryption, alongside technical and organisational safeguards."],
      },
      {
        id: "transfers",
        title: "International data transfers",
        body: [
          "Your data may be transferred to and processed by service providers in India, the United States and other jurisdictions.",
        ],
      },
      {
        id: "retention",
        title: "Data retention and deletion",
        body: ["We keep data only as long as needed:"],
        list: [
          "OAuth tokens are deleted within 24 hours of revoking Gmail access",
          "Account data is deleted within 30 days of account deletion",
          "Voice recordings and models are kept no longer than 3 years after your last interaction, unless the law requires otherwise",
        ],
      },
      {
        id: "rights",
        title: "Your rights",
        body: [
          "Depending on where you live, you may have rights over your personal data, such as access, correction and deletion. To make a request, contact us using the details below.",
        ],
      },
      {
        id: "sms",
        title: "SMS and text messaging",
        body: ["Mobile opt-in data is not sold or shared with third parties for marketing purposes."],
      },
      {
        id: "updates",
        title: "Updates to this policy",
        body: ["We may update this policy from time to time. The date at the top of this page shows when it last changed."],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    script: "the fine print.",
    updated: "February 11, 2026",
    intro:
      "The agreement between you and Botfinity Inc. for using SuperMIA and its agents, including MailPilot. Please read it before you start.",
    official: "https://supermia.ai/terms/",
    highlights: [
      { title: "Your content stays yours", text: "You keep ownership, and grant us only a limited licence to run the services." },
      { title: "You stay in charge", text: "AI outputs can be wrong. Review them before you rely on them or send them." },
      { title: "Monthly, auto-renewing", text: "Subscriptions bill monthly and renew automatically until you cancel." },
      { title: "Texas law", text: "These terms are governed by the laws of Texas, USA." },
    ],
    sections: [
      { id: "services", title: "The services", body: ["SuperMIA is a conversational AI platform. We may change, add or discontinue features over time."] },
      {
        id: "eligibility",
        title: "Eligibility",
        body: ["You must be able to form a binding contract to use the services. Additional restrictions apply to minors, and anyone under 13 may not use the services."],
      },
      {
        id: "accounts",
        title: "Accounts and security",
        body: ["Provide accurate information, keep your credentials safe and tell us about any unauthorised use. You are responsible for activity on your account."],
      },
      {
        id: "acceptable-use",
        title: "Acceptable use",
        body: ["Don't misuse the services. Prohibited conduct includes, for example:"],
        list: ["Distributing malware or spam", "Infringing intellectual property", "Attempting unauthorised access"],
      },
      {
        id: "ai-outputs",
        title: "AI outputs and human oversight",
        body: ["AI-generated output may be inaccurate. You are responsible for reviewing it and keeping appropriate human oversight before acting on it."],
      },
      {
        id: "no-advice",
        title: "No professional advice; no emergency use",
        body: ["The services do not provide medical, legal or financial advice, and must not be used for emergencies."],
      },
      {
        id: "consent",
        title: "Voice, messaging and end-user consent",
        body: ["If you use the services to call or message people, you are responsible for obtaining any legally required consents and honouring opt-outs."],
      },
      {
        id: "recording",
        title: "Call recording (optional)",
        body: ["If you turn on call recording, you must give the required disclosures and obtain any consent the law requires."],
      },
      {
        id: "billing",
        title: "Subscriptions, billing, auto-renewal and taxes",
        body: ["Subscriptions are billed monthly and renew automatically until cancelled. Fees are non-refundable, past-due accounts may be restricted, and applicable taxes are your responsibility."],
      },
      {
        id: "trials",
        title: "Trials, betas and promotions",
        body: ["Trials and promotions may be time-limited, changed or ended. Beta features are provided as is."],
      },
      {
        id: "third-party",
        title: "Third-party services and integrations",
        body: ["The services connect to third-party providers, such as email platforms. We are not responsible for those third-party services."],
      },
      {
        id: "data",
        title: "Data, privacy and retention",
        body: ["Our Privacy Policy explains how we handle personal data. These terms define Customer Data and Usage Data and cover model training and retention. Customer Data is generally kept for up to 90 days after termination."],
      },
      { id: "content-licence", title: "User content licence", body: ["You keep ownership of your content and grant us a limited licence to use it to operate the services."] },
      { id: "ip", title: "Intellectual property", body: ["We own the services. You receive a limited, revocable licence to use them under these terms."] },
      { id: "feedback", title: "Feedback", body: ["If you send us feedback, we may use it without restriction or compensation."] },
      { id: "sla", title: "Service levels", body: ["Uptime commitments apply only under a separate, signed enterprise agreement."] },
      {
        id: "termination",
        title: "Suspension and termination",
        body: ["We may suspend or end access for violations, security risk or non-payment. Some sections continue to apply after termination."],
      },
      { id: "disclaimers", title: "Disclaimers", body: ["The services are provided “as is” and “as available”."] },
      {
        id: "liability",
        title: "Limitation of liability",
        body: ["Indirect damages are excluded. Our total liability is limited to the fees you paid in the three months before the claim, or $100 if you paid nothing."],
      },
      { id: "indemnification", title: "Indemnification", body: ["You agree to indemnify us against claims arising from your use of the services."] },
      { id: "dmca", title: "Copyright complaints (DMCA)", body: ["If you believe content infringes your copyright, you can send us a notice. The official terms explain what to include."] },
      { id: "export", title: "Export compliance and sanctions", body: ["You may not use the services where U.S. export control or sanctions laws prohibit it."] },
      { id: "law", title: "Governing law and venue", body: ["These terms are governed by the laws of Texas. Disputes are heard in the state or federal courts located in Texas."] },
      { id: "changes", title: "Changes to these terms", body: ["Updates take effect when posted. Continuing to use the services means you accept them."] },
    ],
  },
};
