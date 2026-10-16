// Pre-renders the built pages to static HTML and writes the SEO files.
// Runs after `vite build` (client, into dist/) and `vite build --ssr` (server bundle, into dist-ssr/).
import { readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

process.env.NODE_ENV = "production";
const ssr = await import(pathToFileURL("dist-ssr/entry-server.js").href);

// vite.config.ts is the single source of the site URL; it's already written into the canonical link.
const home = await readFile("dist/index.html", "utf8");
const SITE = home.match(/<link rel="canonical" href="(https?:\/\/[^"]+?)\/?"/)?.[1];
if (!SITE) throw new Error("prerender: no canonical link in dist/index.html");
const description = home.match(/<meta\s+name="description"\s+content="([^"]+)"/)[1];

const NAME = "MailPilot AI";
const ALIASES = ["MailPilot", "Mail Pilot", "Mail Pilot AI"];
const { company } = ssr;
const [, city, region, postalCode] = company.address[1].match(/^(.+?), ([A-Z]{2}) (\d{5})/);

const org = {
  "@type": "Organization",
  "@id": `${SITE}/#org`,
  name: "SuperMIA",
  legalName: company.name,
  url: "https://supermia.ai/",
  logo: `${SITE}/icon-512.png`,
  email: company.email,
  telephone: company.phone,
  address: { "@type": "PostalAddress", streetAddress: company.address[0], addressLocality: city, addressRegion: region, postalCode, addressCountry: "US" },
  sameAs: ["https://supermia.ai/", "https://botfinity.ai/"],
};
const website = { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: NAME, alternateName: ALIASES, inLanguage: "en", publisher: { "@id": org["@id"] } };

const homeGraph = [
  org,
  website,
  {
    "@type": "SoftwareApplication",
    "@id": `${SITE}/#app`,
    name: NAME,
    alternateName: ALIASES,
    description,
    url: `${SITE}/`,
    image: `${SITE}/images/og-image.jpg`,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "AI email assistant",
    operatingSystem: "Web",
    featureList: [...ssr.features.map((f) => f.title), "Two-way sync with Gmail and Outlook"],
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free starter credits, no credit card needed", url: ssr.links.signup },
    publisher: { "@id": org["@id"] },
  },
  {
    "@type": "FAQPage",
    "@id": `${SITE}/#faq`,
    mainEntity: ssr.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

const legalGraph = (doc) => {
  const d = ssr.legal[doc];
  const url = `${SITE}/${doc}/`;
  return [
    org,
    website,
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: d.title,
      description: d.intro,
      dateModified: new Date(`${d.updated} 12:00 UTC`).toISOString().slice(0, 10),
      isPartOf: { "@id": website["@id"] },
      publisher: { "@id": org["@id"] },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: NAME, item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: d.title, item: url },
      ],
    },
  ];
};

// `<` is escaped so the JSON can never close the script tag early
const ld = (graph) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`;

const pages = [
  { file: "dist/index.html", body: ssr.renderHome(), graph: homeGraph },
  { file: "dist/privacy/index.html", body: ssr.renderLegal("privacy"), graph: legalGraph("privacy") },
  { file: "dist/terms/index.html", body: ssr.renderLegal("terms"), graph: legalGraph("terms") },
];
for (const p of pages) {
  const html = await readFile(p.file, "utf8");
  if (!html.includes('<div id="root"></div>')) throw new Error(`prerender: no empty #root in ${p.file}`);
  await writeFile(p.file, html.replace('<div id="root"></div>', `<div id="root">${p.body}</div>`).replace("</head>", `    ${ld(p.graph)}\n  </head>`));
}

const today = new Date().toISOString().slice(0, 10);
await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["/", "/privacy/", "/terms/"].map((path) => `  <url><loc>${SITE}${path}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`,
);

await rm("dist-ssr", { recursive: true, force: true });
console.log(`prerendered ${pages.length} pages for ${SITE}`);
