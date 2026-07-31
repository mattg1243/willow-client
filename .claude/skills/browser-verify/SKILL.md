---
name: browser-verify
description: Launch the Willow client + server locally, log in, and drive the app with Playwright to screenshot a real page/component. Use this whenever a UI change needs visual verification instead of just a type-check.
---

# Browser verification for willow-client

This app requires a logged-in session against a real backend, so "running
it" means: dev server up, API server up, log in, navigate, screenshot.

## 1. Start the servers

```bash
# from willow-client/
npm run dev &                                 # Vite on :5173
timeout 30 bash -c 'until curl -sf http://localhost:5173 >/dev/null; do sleep 1; done'

# from willow-server/ (separate repo/checkout, same monorepo)
go run . &                                    # API on :8008
timeout 30 bash -c 'until curl -sf http://localhost:8008 >/dev/null; do sleep 1; done'
```

If something is already listening on 5173/8008 (`lsof -i :5173 -sTCP:LISTEN`),
reuse it rather than starting a second instance.

## 2. Credentials

Test login credentials live in `willow-client/.env.test.local`
(`TEST_LOGIN_EMAIL` / `TEST_LOGIN_PASSWORD`). This file matches the repo's
`*.local` gitignore pattern — **never** move credentials into a tracked
file (including this SKILL.md). If the file doesn't exist yet, ask the
user for a dev login and write it there in the same `KEY=value` format.

## 3. Drive the app

`.claude/scripts/verify-app.mjs` is a small Playwright driver: it logs in
using the credentials above, then runs a JSON list of steps against the
page, screenshotting on request.

```bash
node .claude/scripts/verify-app.mjs '[
  { "action": "goto", "path": "/app" },
  { "action": "click", "text": "Steph C" },
  { "action": "wait-for", "text": "Statement" },
  { "action": "click", "text": "Statement" },
  { "action": "wait-for", "text": "Create statement" },
  { "action": "screenshot", "name": "statement-modal" }
]'
```

Supported actions: `goto` (`path` relative to `BASE_URL`, default
`http://localhost:5173`), `click` (`text`, optional `exact`),
`click-role` (`role`, `name`), `wait-for` (`text`), `screenshot` (`name`
— written to `.claude/scripts/screenshots/<name>.png`).

Then read the screenshot with the Read tool to actually look at it.

Console/page errors encountered during the run are printed to stderr —
check them, but note the app already has some pre-existing unrelated
console errors (e.g. in the Payout and EventForm components on certain
clients); don't assume every printed error is caused by your change.

## Gotchas

- Login form fields have no `name` attribute — select by placeholder
  (`Email` / `Password`), which is what the script already does.
- First navigation after a fresh Vite start can take a few seconds to
  compile; the script's `wait-for` steps handle this, raw `sleep` won't.
- The seeded dev account only has one client ("Steph C" as of writing)
  with a negative retainer balance — useful for checking negative-number
  formatting, but don't hardcode assumptions about which clients exist.
