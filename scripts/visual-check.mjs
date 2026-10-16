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
  // on desktop the tab glides the page to that folder; wait for it to open
  await page
    .waitForFunction(() => /Follow-ups/.test(document.querySelector(".mf.is-front h3")?.textContent ?? ""), null, { timeout: 6000 })
    .catch(() => {});
  const folder = await page.locator(".mf.is-front h3").textContent();

  // Control: approve the draft with one click
  await page.locator("#control").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: /Approve with one click/ }).click();
  // wait for the outcome rather than a fixed time (software WebGL in headless browsers can stall the page briefly)
  await page
    .waitForFunction(() => document.querySelector(".ltr__status.is-on, .outbox__item"), null, { timeout: 15000 })
    .catch(() => {});
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
