// Smoke test: run `npm run dev` first, then `node scripts/visual-check.mjs`.
import { chromium } from "playwright";

const URL = process.env.URL ?? "http://localhost:5173/";
const browser = await chromium.launch();
const results = [];
const logs = [];

async function check(name, viewport, reducedMotion = "no-preference") {
  const page = await browser.newPage({ viewport, reducedMotion });
  page.on("console", (m) => m.type() === "error" && logs.push(`${name}: ${m.text()}`));
  page.on("pageerror", (e) => logs.push(`${name}: pageerror ${e.message}`));
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(reducedMotion === "reduce" ? 600 : 3500);

  // Folders: open "Follow-ups"
  await page.locator("#features").scrollIntoViewIfNeeded();
  await page.getByRole("tab", { name: /Follow-ups/ }).click();
  await page.waitForTimeout(500);
  const folder = await page.locator(".mf.is-front h3").textContent();

  // Control: approve the draft with one click
  await page.locator("#control").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Approve with one click/ }).click();
  await page.waitForTimeout(1200);
  const sealed = (await page.locator(".ltr__status.is-on").count()) + (await page.locator(".outbox__item").count());

  // FAQ
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /What does it cost/ }).click();
  const faqOpen = await page.locator(".faq__item.is-open .faq__q").textContent();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  results.push({ name, overflow, folder, sealed, faqOpen });
  await page.close();
}

await check("desktop-1920", { width: 1920, height: 1080 });
await check("laptop-1440", { width: 1440, height: 900 });
await check("mobile-390", { width: 390, height: 844 });
await check("reduced-motion", { width: 1440, height: 900 }, "reduce");
await browser.close();
console.log(JSON.stringify({ results, logs }, null, 2));
