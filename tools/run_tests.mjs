/**
 * Run the browser test suite headlessly and fail the build if anything breaks.
 *
 * The suite lives in tests/tests.html because the application has no build step
 * and the tests must stay runnable by opening a file. This script drives the
 * same page with a headless browser so CI runs exactly what a person runs.
 *
 *   node tools/run_tests.mjs [url]
 */
import { chromium } from "playwright";

const URL = process.argv[2] || "http://localhost:8124/tests/tests.html";

const browser = await chromium.launch();
const page = await browser.newPage();

const consoleErrors = [];
page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", e => consoleErrors.push(String(e)));

await page.goto(URL, { waitUntil: "load" });

// The suite is async (it awaits mocked sign-in calls), so wait for the summary
// to be populated rather than assuming it is ready on load.
await page.waitForFunction(
  () => (document.getElementById("summary")?.textContent || "").includes("passing"),
  { timeout: 20000 }
);

const result = await page.evaluate(() => ({
  summary: document.getElementById("summary").textContent.trim(),
  total: document.querySelectorAll("li.ok, li.no").length,
  failures: [...document.querySelectorAll("li.no")].map(li => li.textContent.trim()),
  groups: [...document.querySelectorAll(".grp")].map(g => g.textContent.trim()),
}));

await browser.close();

console.log(`\n${result.summary}`);
console.log(`groups: ${result.groups.join(" | ")}`);
console.log(`assertions: ${result.total}`);

if (consoleErrors.length) {
  console.error("\nconsole errors during the run:");
  consoleErrors.forEach(e => console.error("  " + e));
}

if (result.failures.length) {
  console.error(`\n${result.failures.length} FAILING:`);
  result.failures.forEach(f => console.error("  " + f));
  process.exit(1);
}

if (result.total === 0) {
  console.error("\nno assertions ran — the suite did not execute");
  process.exit(1);
}

if (consoleErrors.length) {
  console.error("\nfailing the build because the page reported console errors");
  process.exit(1);
}

console.log("\nall assertions passed");
