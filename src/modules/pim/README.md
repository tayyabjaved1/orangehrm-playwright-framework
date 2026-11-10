# PIM

## Scope
Covers the PIM module's Employee Information: adding a new employee through the
Add Employee form and managing it in the Employee List. Coverage is
**mutating-and-self-cleaning** (see `docs/ARCHITECTURE.md` §7): the one journey
implemented creates a uniquely-named employee, verifies it, then deletes it —
all inside a single test, so nothing is left behind on the shared instance.

## Navigation
- Entry route(s): `/web/index.php/pim/viewPimModule` (Employee List),
  `/web/index.php/pim/addEmployee` (Add Employee), and
  `/web/index.php/pim/viewPersonalDetails/empNumber/{id}` (Personal Details,
  reached only via the Add Employee workflow).
- Preconditions: logged in as Admin via the shared `storageState` — no
  module-specific precondition beyond that.
- Required role/account: Admin (the shared `ADMIN_USERNAME`/`ADMIN_PASSWORD`).

## Architecture
- Page Objects:
  - `AddEmployeePage` (`src/modules/pim/pages/add-employee.page.ts`) — extends
    `BasePage`; `waitForLoaded()` anchors on the page's own "Add Employee"
    heading (level 6), since the PIM breadcrumb reads just "PIM" on every PIM
    route and can't distinguish them.
  - `EmployeeListPage` (`src/modules/pim/pages/employee-list.page.ts`) —
    extends `BasePage`; `waitForLoaded()` anchors on the "Employee Information"
    heading (level 5), for the same reason.
  - `EmployeeDetailsPage` (`src/modules/pim/pages/employee-details.page.ts`) —
    extends `BasePage`; `waitForLoaded()` anchors on the URL pattern
    (`/pim/viewPersonalDetails/empNumber/\d+`) plus the "Personal Details"
    heading. This page is only ever reached via `AddEmployeePage.submit()`'s
    redirect — its URL carries a server-assigned employee number that doesn't
    exist beforehand, so specs call `waitForLoaded()` directly on it, never
    `open()`/`goto()`.
- Factories/generators: `EmployeeFactory` (`src/data/factories/employee.factory.ts`),
  built on the shared `CommonGenerator` (`firstName()`, `lastName()`).
- Types: `EmployeeData` (`src/data/types/pim.types.ts`) — `{ firstName,
  lastName }`.

## Test data
`EmployeeFactory.create(overrides?)` returns a fresh `{ firstName, lastName }`
on every call via Faker, so two concurrent runs against the shared demo can
never collide on employee name. The Employee Id field OrangeHRM auto-fills on
the Add Employee form is left untouched — it isn't asserted on or used to
find/delete the record; the full name is used for that instead.

## Lifecycle and cleanup
The single journey (`adds an employee, verifies it in the list, then deletes
it`) runs create → verify → delete → verify-gone entirely inside its own
`test()`, as named `test.step()`s — no separate teardown hook:
1. Add the employee via `AddEmployeePage.submit()`.
2. Verify the resulting Personal Details page shows the generated name.
3. Verify the employee appears exactly once in the Employee List (searched by
   the generated full name).
4. Delete it via the list's row checkbox + "Delete Selected" + confirm dialog.
5. Verify the live-search suggestion list reports "No Records Found" for that
   same name, confirming it's gone.

## Automated coverage
See `docs/TEST_CATALOG.md` for the full catalog. This module's scenario:
- `PIM - Add Employee` › `adds an employee, verifies it in the list, then
  deletes it` — `@regression @ui`

## Run
```bash
npx playwright test src/modules/pim/tests
```

## Known limitations
- Only the Add Employee → verify → delete journey is implemented; other PIM
  sub-features (Reports, bulk actions on existing records, editing an
  existing employee's other detail tabs) are out of scope for this module.
- `EmployeeListPage`'s name filter is scoped via a documented CSS fallback
  (`.oxd-input-group` containing the "Employee Name" label text), because that
  field and "Supervisor Name" share the same placeholder and OrangeHRM's
  `<label>` isn't wired to its input via `for`/`id`, so neither `getByLabel`
  nor `getByPlaceholder` can resolve it uniquely.
- `EmployeeListPage.deleteEmployee()` clicks the row's `.oxd-checkbox-input-icon`
  (a documented CSS fallback) rather than the checkbox `<input>` itself: the
  real input is present in the DOM but a custom check icon is rendered on top
  of it and intercepts the click.
- The Employee Name filter is an autocomplete bound to a selected suggestion,
  not the raw typed text — searching without first selecting the matching
  suggestion silently ignores the name filter. `searchByName()` always selects
  the suggestion before searching; `expectEmployeeNotListed()` instead asserts
  directly on the suggestion list's own "No Records Found" state, since a
  deleted employee has no suggestion left to select into the grid's filter.
