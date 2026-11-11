# Configuration

## Environment variables (`.env`, copy from `.env.example`)

| Variable | Purpose |
|---|---|
| `BASE_URL` | Target instance — defaults to the public OrangeHRM demo |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Credentials `src/setup/auth.setup.ts` uses for the one real login |

Read every value through `requireEnv()` (`src/core/env.ts`) — never hardcode
credentials or URLs in a spec or page object.

## `playwright.config.ts`

- **`testDir: './src'`** — specs, setup, pages, data all live under `src/`.
- **Three projects**:
  - `setup` — runs `src/setup/auth.setup.ts`, logs in once, saves `storageState`.
  - `chromium-auth` — the Auth module only (`**/modules/auth/**/*.spec.ts`), no
    `storageState`, no dependency on `setup` — it exercises the real login form.
  - `chromium` — everything else, `storageState: 'playwright/.auth/admin.json'`,
    `dependencies: ['setup']` — starts already authenticated.
- **`fullyParallel: true`**; CI uses 2 workers and 2 retries; local uses the
  Playwright default worker count and 0 retries.
- **Reporters**: `list` (terminal) + `html` (local report, `playwright-report/`)
  + `allure-playwright` (raw results written to `allure-results/`, rendered via
    the `report:allure*` npm scripts — see below).
- **Artifacts**: trace/video/screenshot all set to retain-on-failure/only-on-failure.

## Allure reporting

`allure-playwright` writes raw results to `allure-results/` on every run
(local or CI) — no extra flag needed, it's just another configured reporter.
Rendering that into a browsable report is a separate step, requiring the
`allure` CLI (bundled via `allure-commandline`, which needs a Java runtime —
Java 11+ on your machine, or `actions/setup-java` in CI):

```bash
npm run report:allure:generate   # renders allure-results/ -> allure-report/
npm run report:allure:open       # opens allure-report/ in a browser
npm run report:allure            # both, in one command
```

Unlike core-pw-e2e-tests, this repo does **not** publish Allure's trend-history
view across runs (that needs a separate persistent location — e.g. a GitHub
Pages branch or another repo — to store prior `allure-report/history/`
between runs). CI uploads a fresh `allure-report/` as a build artifact on every
run instead; each run's report is self-contained with no cross-run trend graph.

## CI (`.github/workflows/`)

- `playwright.yml` — installs deps (including a JDK for the Allure CLI),
  typechecks, runs the suite, generates the Allure report, and uploads both the
  Playwright HTML report and the Allure report as build artifacts (`if: always()`,
  so a failing run's reports are still available).
- `docs-check.yml` — runs `scripts/check-docs-changes.mjs` against the PR diff;
  see `docs/DOCUMENTATION_POLICY.md`.
