# Claim

## Scope
Covers the Claim module's landing page — the Employee Claims list. This
module's coverage is **read-only**: submitting a new claim (via "Assign Claim")
writes a durable record to the shared public demo instance with no safe undo
path, so per `docs/ARCHITECTURE.md` §7 this module only verifies the module's
own page loads and its real content renders — it never drives the Assign Claim
form.

## Navigation
- Entry route(s): `/web/index.php/claim/viewClaimModule` — the live instance
  redirects this to `/web/index.php/claim/viewAssignClaim` (the Employee Claims
  list), which is the page this module's page object waits on.
- Preconditions: logged in as Admin via the shared `storageState` (true for
  every module except Auth). No module-specific precondition.
- Required role/account: Admin (via the shared session).

## Architecture
- Page Objects: `ClaimPage` (`src/modules/claim/pages/claim.page.ts`) — extends
  `BasePage`, `waitForLoaded()` anchored on `this.breadcrumb('Claim')` (the
  topbar breadcrumb reads "Claim", not "Employee Claims" — the latter is the
  in-page `<h5>` heading, asserted separately).
- Factories/generators: none — this module creates no data.
- Types: none.

## Test data
No generated data. The spec reads only real, already-present content on the
shared instance: the "Employee Claims" heading, the claims grid's column
headers, the "(n) Records Found" count text, and the "Assign Claim" button.
None of these are hardcoded sample rows — the assertions target structural
content (headings, column headers, the records-found label) that is stable
regardless of which claim records currently exist on the shared instance.

## Lifecycle and cleanup
Read-only — no data is created, so there is nothing to clean up. See §7 of
`docs/ARCHITECTURE.md`: submitting a claim on this shared public instance has
no safe undo, so the "Assign Claim" action's presence is verified without ever
clicking it.

## Automated coverage
See `docs/TEST_CATALOG.md`. Scenario in this module:

- `Claim - View Employee Claims` (`@smoke @ui`) — opens the Claim module and
  verifies the Employee Claims list heading, grid column headers, records-found
  count, and the Assign Claim button are all visible.

## Run
```bash
npx playwright test src/modules/claim/tests
```

## Known limitations
- No raw-selector fallbacks were needed — every assertion resolves via
  `getByRole` (heading, columnheader, button) or `getByText`.
- The "Assign Claim" submission flow is intentionally not driven (see Scope
  and Lifecycle above) — this is a shared public instance with no per-run
  tenant and no API to reset state.
- The grid's specific rows (e.g. "John Doe" sample claims) are real data
  already present on the shared instance and may change or be reset by the
  demo's maintainers at any time; the spec does not assert on specific row
  content for that reason, only on the grid's structural/stable content.
