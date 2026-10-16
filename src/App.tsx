import { useRef } from "react";
import { useHeadlineSplits, useReveals, useSmoothScroll } from "./lib/motion";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { DayStrip } from "./components/DayStrip";
import { Demo } from "./components/Demo";
import { Folders } from "./components/Folders";
import { Steps } from "./components/Steps";
import { Audience } from "./components/Audience";
import { Control } from "./components/Control";
import { Brochure } from "./components/Brochure";
import { Faq } from "./components/Faq";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  useSmoothScroll();
  useReveals();
  useHeadlineSplits(root);

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <DayStrip />
        <Demo />
        <Folders />
        <Steps />
        <Audience />
        <Control />
        <Brochure />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
