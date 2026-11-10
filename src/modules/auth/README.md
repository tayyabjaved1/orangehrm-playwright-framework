# Auth

## Scope
The login form itself: valid credentials reach the dashboard; an invalid
password is rejected with a visible error. Read-only by nature — logging in
creates no durable data.

## Navigation
- Entry route: `/web/index.php/auth/login`
- Preconditions: none — this is the one module that must **not** start
  pre-authenticated (see `docs/ARCHITECTURE.md` §3).
- Required role/account: `ADMIN_USERNAME`/`ADMIN_PASSWORD` from `.env`.

## Architecture
- Page Objects: `pages/login.page.ts` (`LoginPage`) — extends `BasePage`,
  `waitForLoaded()` anchored on the `Login` heading.
- Factories/generators: none.
- Types: none.

## Test data
None generated — both scenarios use the real `ADMIN_USERNAME`/`ADMIN_PASSWORD`
(valid case) or a deliberately wrong password literal (invalid case).

## Lifecycle and cleanup
Nothing persisted. No teardown.

## Automated coverage
See `docs/TEST_CATALOG.md`. `src/modules/auth/tests/login.spec.ts`:
- Valid login reaches the dashboard (`@smoke @ui`)
- Invalid password shows an error, no navigation (`@smoke @ui`)

## Run
```bash
npx playwright test src/modules/auth/tests
```

## Known limitations
- Only the login form is covered — "Forgot your password?" and logout are not
  yet automated.
- This spec runs in the `chromium-auth` Playwright project (no `storageState`)
  — see `playwright.config.ts`. Don't move it into the shared `chromium` project.
