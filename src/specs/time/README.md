# Time

## Scope
Covers the Time module's landing page — the "Employee Timesheets" view that
`/web/index.php/time/viewTimeModule` redirects to. This module is **read-only**:
its only meaningful actions (submitting, approving, or rejecting a timesheet)
mutate durable shared data on the public demo instance with no safe undo, so per
`docs/ARCHITECTURE.md` §7 this suite only verifies the page loads and its real
content renders — no timesheet is viewed, submitted, or approved.

## Navigation
- Entry route(s): `/web/index.php/time/viewTimeModule`, which OrangeHRM
  redirects to `/web/index.php/time/viewEmployeeTimesheet` ("Employee
  Timesheets" / breadcrumb "Time" > "Timesheets").
- Preconditions: logged in as Admin via the shared `storageState` — no
  module-specific precondition.
- Required role/account: Admin (via `ADMIN_USERNAME`/`ADMIN_PASSWORD`).

## Architecture
- Page Objects: `EmployeeTimesheetsPage` (`pages/employee-timesheets.page.ts`) —
  extends `BasePage`, `waitForLoaded()` anchored on the `Timesheets` breadcrumb
  entry (`this.breadcrumb('Timesheets')`).
- Factories/generators: none — read-only module, no data created.
- Types: none.

## Test data
No generated data. The spec reads whatever timesheet records already exist on
the shared instance; the "Records Found" count is asserted as a pattern
(`/\(\d+\) Records? Found/`), never a literal number, since it can change
concurrently.

## Lifecycle and cleanup
Read-only — no create/verify/delete sequence. The spec only opens the page and
asserts real, specific content is visible (see §7).

## Automated coverage
See `docs/TEST_CATALOG.md`. This module's scenario:
- "shows the timesheets landing page with pending-action content" —
  `@smoke @ui` (`test.describe('Time - View Employee Timesheets', ...)`).

## Run
```bash
npx playwright test src/specs/time
```

## Known limitations
- The Time module's landing page is **not** the "My Timesheets" day-grid
  implied by a generic reading of the module name — the logged-in Admin
  account lands on "Employee Timesheets," which shows a "Select Employee"
  lookup and a "Timesheets Pending Action" table (columns: Employee Name,
  Timesheet Period, Actions) of other employees' submitted timesheets. There is
  no current-period date range or day-of-week header row on this landing page;
  those only appear after opening an individual employee's timesheet via its
  "View" action, which this suite intentionally does not drive (see Scope).
- The "Employee Name" input on the Select Employee section has no
  `<label>`/`aria-labelledby` association in OrangeHRM's markup — the visible
  "Employee Name*" text is a sibling node, not a real label — so the page
  object resolves it via `getByPlaceholder('Type for hints...')` instead of
  `getByLabel`, per the selector policy fallback order (`docs/ARCHITECTURE.md`
  §5).
- Submitting, viewing, approving, or rejecting any individual timesheet is
  intentionally left undriven — this is a shared public instance with no
  per-run tenant and no safe way to undo those actions.
