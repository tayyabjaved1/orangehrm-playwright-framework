# Directory

## Scope
Covers searching the OrangeHRM employee Directory by name and verifying that
real results render. This module is **read-only** (see `docs/ARCHITECTURE.md`
§7): searching the directory is a GET-style query against existing employee
records — it creates nothing, so there is no data to clean up.

## Navigation
- Entry route(s): `/web/index.php/directory/viewDirectory`
- Preconditions: logged in as Admin via the shared `storageState` (true for
  every module except Auth). No module-specific precondition.
- Required role/account: Admin (the shared session every module reuses).

## Architecture
- Page Objects: `DirectoryPage` (`src/pages/directory/directory.page.ts`)
  — extends `BasePage`, implements `waitForLoaded()` anchored on the
  `Directory` breadcrumb (`this.breadcrumb('Directory')`).
- Factories/generators: none — searching doesn't create data.
- Types: none.

## Test data
No generated data. The spec searches the live, shared directory using a
broad common letter (`'a'`) rather than any specific employee's name, since
the directory's contents are real PIM employees added/removed by other
concurrent users of this shared public instance and change over time.
Assertions target the *shape* of the response (a result card with a visible
name, or an explicit "No Records Found" message) rather than a specific
employee, so the test stays valid regardless of which employees currently
exist.

## Lifecycle and cleanup
Read-only — no record is created, so there is nothing to delete. Searching
the directory does not mutate shared data.

## Automated coverage
See `docs/TEST_CATALOG.md`. Scenario:
- Search the Directory by a common name fragment and verify results render
  — `@smoke @ui` (`test.describe('Directory - Search Employees', { tag: [...] })`).

## Run
```bash
npx playwright test src/specs/directory
```

## Known limitations
- OrangeHRM's Employee Name autocomplete only actually filters results once
  a suggestion is *selected* from its dropdown — free-typed text alone is
  not applied as a server-side filter. `DirectoryPage.searchByName()`
  accounts for this by selecting the first real suggestion (skipping the
  dropdown's own placeholder "No Records Found" option) before submitting
  the search.
- The directory result card's name text (`.orangehrm-directory-card`,
  `.orangehrm-directory-card-header`) exposes no accessible role, label, or
  text landmark of its own beyond the rendered employee name — these are
  OrangeHRM's own CSS classes, used as a documented fallback per
  `docs/ARCHITECTURE.md` §5 because no stronger selector resolves.
- Job title is not asserted on the result card: several employees on this
  shared instance have no job title set, so asserting on it would be
  flaky independent of any real regression; the name is asserted instead,
  which every employee record has.
