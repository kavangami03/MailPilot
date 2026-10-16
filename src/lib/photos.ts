// Every image in src/assets/photos is picked up at build time.
// Drop a file named e.g. "crew-sales.jpg" in that folder and <Photo name="crew-sales" /> shows it —
// no code change, and no 404s for images that don't exist yet (those slots render a designed fallback).
const files = import.meta.glob<string>("../assets/photos/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const byName: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const name = path
    .split("/")
    .pop()!
    .replace(/\.(jpe?g|png|webp|avif)$/i, "");
  byName[name] = url;
}

export const photoUrl = (name: string): string | undefined => byName[name];
