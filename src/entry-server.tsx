// Server entry for pre-rendering (see scripts/prerender.mjs). Each page is rendered to static HTML at
// build time, so search engines and link previews get the real content without running JavaScript.
import { renderToString } from "react-dom/server";
import App from "./App";
import { Legal } from "./components/Legal";
import type { LegalDoc } from "./data/legal";

export { faqs, features, links } from "./data/content";
export { company, legal } from "./data/legal";

export const renderHome = () => renderToString(<App />);
export const renderLegal = (doc: LegalDoc) => renderToString(<Legal doc={doc} />);
