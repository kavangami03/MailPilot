import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// The site's public address: canonical links, social cards, structured data and the sitemap all use it.
// When the site moves to its own domain, set SITE_URL on the host (e.g. in Vercel's environment variables).
const SITE_URL = (process.env.SITE_URL ?? "https://mail-pilot-nu.vercel.app").replace(/\/+$/, "");

const siteUrl = (): Plugin => ({
  name: "site-url",
  transformIndexHtml: (html) => html.replaceAll("%SITE_URL%", SITE_URL),
});

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), siteUrl()],
  // bundled into the pre-render build: their Node entry points are CommonJS
  ssr: { noExternal: ["gsap", "@gsap/react", "lucide-react"] },
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            main: "index.html",
            privacy: "privacy/index.html",
            terms: "terms/index.html",
          },
        },
      },
}));
