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
- **Reporters**: `list` + local `html` report (`playwright-report/`).
- **Artifacts**: trace/video/screenshot all set to retain-on-failure/only-on-failure.

## CI (`.github/workflows/`)

- `playwright.yml` — installs deps, typechecks, runs the suite, uploads the
  HTML report.
- `docs-check.yml` — runs `scripts/check-docs-changes.mjs` against the PR diff;
  see `docs/DOCUMENTATION_POLICY.md`.
