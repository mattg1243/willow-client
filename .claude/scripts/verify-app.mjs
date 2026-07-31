// Ad-hoc browser verification driver for the Willow client.
// Logs in with credentials from .env.test.local, then runs a scripted
// sequence of actions passed as JSON on argv, screenshotting each step.
//
// Usage:
//   node .claude/scripts/verify-app.mjs '[
//     { "action": "goto", "path": "/app" },
//     { "action": "click", "text": "Jane Doe" },
//     { "action": "click", "text": "Statement" },
//     { "action": "screenshot", "name": "statement-modal" }
//   ]'
//
// Screenshots are written to .claude/scripts/screenshots/<name>.png

import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseURL = process.env.BASE_URL || "http://localhost:5173";
const screenshotDir = path.join(__dirname, "screenshots");
mkdirSync(screenshotDir, { recursive: true });

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", "..", ".env.test.local");
  const contents = readFileSync(envPath, "utf-8");
  const vars = {};
  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return vars;
}

async function login(page) {
  const env = loadEnvLocal();
  if (!env.TEST_LOGIN_EMAIL || !env.TEST_LOGIN_PASSWORD) {
    throw new Error(
      "Missing TEST_LOGIN_EMAIL/TEST_LOGIN_PASSWORD in .env.test.local",
    );
  }
  await page.goto(`${baseURL}/auth/login`);
  await page.getByPlaceholder("Email").fill(env.TEST_LOGIN_EMAIL);
  await page.getByPlaceholder("Password").fill(env.TEST_LOGIN_PASSWORD);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL(/\/app/, { timeout: 10000 });
}

async function run(steps) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  try {
    await login(page);

    for (const step of steps) {
      switch (step.action) {
        case "goto":
          await page.goto(`${baseURL}${step.path}`);
          break;
        case "click":
          await page.getByText(step.text, { exact: step.exact ?? false }).first().click();
          break;
        case "click-role":
          await page.getByRole(step.role, { name: step.name }).click();
          break;
        case "wait-for":
          await page.getByText(step.text).first().waitFor({ timeout: 10000 });
          break;
        case "screenshot": {
          const file = path.join(screenshotDir, `${step.name}.png`);
          await page.screenshot({ path: file });
          console.log(`Saved screenshot: ${file}`);
          break;
        }
        default:
          throw new Error(`Unknown action: ${step.action}`);
      }
    }
  } finally {
    if (errors.length) {
      console.error("Console/page errors observed:\n" + errors.join("\n"));
    }
    await browser.close();
  }
}

const stepsArg = process.argv[2];
if (!stepsArg) {
  console.error("Usage: node verify-app.mjs '<json steps array>'");
  process.exit(1);
}
run(JSON.parse(stepsArg)).catch((err) => {
  console.error(err);
  process.exit(1);
});
