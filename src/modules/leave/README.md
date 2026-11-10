# Leave

## Scope
Covers the employee self-service leave journey: applying for leave, verifying it in
My Leave, and cancelling it. This module's coverage is **mutating-and-self-cleaning**
(see `docs/ARCHITECTURE.md` §7): every leave request the spec creates is cancelled
before the test ends, and the one additional mutation it performs as a precondition
(granting a leave entitlement — see "Known limitations" below) only ever adds balance
to the already-authenticated Admin's own employee record, never touches another
employee's data, and is not destructive/irreversible.

## Navigation
- Entry route(s): `/web/index.php/leave/viewLeaveModule` (redirects to Leave List for
  Admin), `/web/index.php/leave/applyLeave` (Apply Leave), `/web/index.php/leave/viewMyLeaveList`
  (My Leave), `/web/index.php/leave/addLeaveEntitlement` (Add Leave Entitlement)
- Preconditions: logged in as Admin via the shared `storageState` (true for every
  module except Auth). No module-specific precondition beyond that — the spec grants
  its own entitlement precondition itself, as part of the test (see below).
- Required role/account: Admin (the same account every module shares). The leave
  request is applied for and cancelled against Admin's own employee record,
  `John Mike Doe` (verified live via My Info, empNumber 7 — the topbar's "John Doe"
  label is a truncated display of this same employee's full name).

## Architecture
- Page Objects:
  - `ApplyLeavePage` (`src/modules/leave/pages/apply-leave.page.ts`) — extends
    `BasePage`, `waitForLoaded()` anchored on the `Apply Leave` heading.
  - `MyLeavePage` (`src/modules/leave/pages/my-leave.page.ts`) — extends `BasePage`,
    `waitForLoaded()` anchored on the `My Leave List` heading.
  - `AddLeaveEntitlementPage` (`src/modules/leave/pages/add-leave-entitlement.page.ts`)
    — extends `BasePage`, `waitForLoaded()` anchored on the module breadcrumb
    (`this.breadcrumb('Leave')`) plus the page's own `Add Leave Entitlement` text (this
    view renders its title as a plain `<p>`, not a heading role).
- Factories/generators: `LeaveFactory` (`src/data/factories/leave.factory.ts`), built
  from `CommonGenerator`'s date and username primitives.
- Types: `LeaveApplicationData` (`src/data/types/leave.types.ts`).

## Test data
`LeaveFactory.create()` returns `{ fromDate, toDate, comment }`:
- `fromDate`/`toDate` — the same ISO `yyyy-mm-dd` date (a single-day request), offset
  randomly (not fixed) within the current calendar year's remaining days. Randomised
  so two runs started the same day don't both target the same date and trip
  OrangeHRM's "Overlapping Leave Request" validation against each other; kept within
  the current year because the entitlement the spec grants itself is only valid for
  OrangeHRM's default leave period (the current calendar year).
- `comment` — `QE automated leave request <CommonGenerator.username()>`, a unique
  token used to find this exact request later in My Leave (the list has no comment
  search field, so the spec matches it against each row's own rendered text).

No static/reference data is depended on: the leave type applied against is always
whichever one is first in the dropdown at runtime (never hardcoded), since which
leave types a given instance exposes varies.

## Lifecycle and cleanup
This module creates data, inside a single test, in this order:
1. **Grant** a leave entitlement for the current employee (precondition — see "Known
   limitations").
2. **Verify** the entitlement was granted (success toast).
3. **Apply** for leave with the factory's data.
4. **Verify** the application was submitted (success toast).
5. **Verify** the request appears in My Leave with `Pending Approval` status, found by
   its unique comment token.
6. **Cancel** the request via its row's own `Cancel` action.
7. **Verify** the request's status is now `Cancelled` — OrangeHRM does not delete a
   cancelled leave request; it changes status and the record stays listed (verified
   live), so this is the correct terminal assertion rather than expecting it gone.

All of this happens inside the test's own steps — there is no separate teardown hook.
The entitlement itself is not revoked at the end of the test: it is additive balance
on Admin's own employee record (never a destructive or irreversible change, and never
touches another employee), consistent with §7.

## Automated coverage
See `docs/TEST_CATALOG.md`. This module's one scenario:

- **Leave - Apply and Cancel Leave Request** — `applies for leave, verifies it in My
  Leave, then cancels it` — tags: `@smoke @ui` (`src/modules/leave/tests/leave.spec.ts`)

## Run
```bash
npx playwright test src/modules/leave/tests
```

## Known limitations
- **Zero starting leave balance (live-site quirk, adapted to).** The shared demo's
  Admin/`John Mike Doe` account carries zero leave balance for every leave type
  (verified live: Apply Leave renders no form at all, just "No Leave Types with Leave
  Balance"). The brief's assumption of "pick whatever first option is available in
  the dropdown" doesn't hold until a balance exists, so the spec grants itself one via
  `AddLeaveEntitlementPage` as its first real step, then proceeds exactly as planned
  (first-available leave type, never hardcoded).
- **Masked date inputs are unreliable to type into (live-site quirk, adapted to).**
  Both `fill()` and typing at speed into the Apply Leave date fields intermittently
  garble the value (e.g. produce `2026-12-102026-12-10`) or reorder digits (e.g.
  `2026-22-11`) — a timing bug in the component, verified live and reproducible across
  multiple approaches. `ApplyLeavePage` instead drives the date picker UI directly:
  opens it via the calendar icon, selects the target month from its dropdown, then
  clicks the exact day cell — this is the one raw-CSS-class fallback in this module
  beyond the documented field-group lookups, and is necessary because the picker's day
  cells and month dropdown options expose no accessible role/name of their own.
- **The Apply button occasionally has no effect on the first click (live-site quirk,
  adapted to).** Verified live: clicking it sometimes produces no visible result at
  all (no toast, no error, form unchanged) — an actionability flake on this specific
  button, not a duplicate-submission risk, since nothing was sent. `apply()` retries
  the same click up to three times until the success toast appears.
- **Field labels aren't programmatically associated with their inputs.** Every form in
  this module (`Apply Leave`, `Add Leave Entitlement`) has visible `<label>`s with no
  `for`/`id`/wrapping relationship to their inputs (verified live — `getByLabel`
  resolves to nothing). Fields are instead located via their label's enclosing
  `.oxd-input-group` text container, documented inline in each page object per
  `docs/ARCHITECTURE.md` §5.
