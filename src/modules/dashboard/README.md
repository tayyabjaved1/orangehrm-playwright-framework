# Dashboard

## Scope
The post-login landing page. Read-only by design — the dashboard only
aggregates other modules' data; there's nothing here to create or clean up.

## Navigation
- Entry route: `/web/index.php/dashboard/index`
- Preconditions: logged in (shared `storageState` — see `docs/ARCHITECTURE.md` §3).
- Required role/account: none beyond the shared Admin session.

## Architecture
- Page Objects: `pages/dashboard.page.ts` (`DashboardPage`) — extends
  `BasePage`, `waitForLoaded()` anchored on the `Dashboard` breadcrumb; also
  exposes `openModule(name)` for other modules' page objects to navigate via
  the sidebar if needed.
- Factories/generators: none.
- Types: none.

## Test data
None.

## Lifecycle and cleanup
Nothing persisted. No teardown.

## Automated coverage
See `docs/TEST_CATALOG.md`. `src/modules/dashboard/tests/dashboard.spec.ts`:
key widgets ("Time at Work", "My Actions", "Quick Launch") visible after login (`@smoke @ui`).

## Run
```bash
npx playwright test src/modules/dashboard/tests
```

## Known limitations
- Doesn't assert on widget *content* (e.g. actual leave/attendance numbers) —
  those are shared-instance data that changes constantly; only presence of the
  widgets themselves is verified.
