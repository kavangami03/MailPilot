import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource-variable/inter";
import "@fontsource/caveat/700.css";
import "./styles/tokens.css";
import "./styles/base.css";
import { Legal } from "./components/Legal";
import type { LegalDoc } from "./data/legal";

const doc = (document.body.dataset.doc ?? "privacy") as LegalDoc;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Legal doc={doc} />
  </StrictMode>,
);
