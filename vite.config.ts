import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        privacy: "privacy/index.html",
        terms: "terms/index.html",
      },
    },
  },
});
