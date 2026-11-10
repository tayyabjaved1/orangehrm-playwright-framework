# My Info

## Scope
Covers the My Info module's landing page — the "Personal Details" tab that
`/web/index.php/pim/viewMyDetails` redirects the logged-in user to for their
own employee record. This module is **read-only**: editing or saving any
personal-details field would mutate durable shared data on the public demo
instance with no safe undo, so per `docs/ARCHITECTURE.md` §7 this suite only
verifies the page loads and real, specific content renders for the logged-in
user — no field is edited and no Save button is clicked.

## Navigation
- Entry route(s): `/web/index.php/pim/viewMyDetails`, which OrangeHRM
  redirects to `/web/index.php/pim/viewPersonalDetails/empNumber/<n>` (breadcrumb
  reads "PIM" > "Personal Details").
- Preconditions: logged in as Admin via the shared `storageState` — no
  module-specific precondition.
- Required role/account: Admin (via `ADMIN_USERNAME`/`ADMIN_PASSWORD`).

## Architecture
- Page Objects: `PersonalDetailsPage` (`pages/personal-details.page.ts`) —
  extends `BasePage`, `waitForLoaded()` anchored on the `PIM` breadcrumb
  (`this.breadcrumb('PIM')`) plus the "Personal Details" heading and the
  Employee Id input, since the heading renders before the form section's own
  AJAX load finishes.
- Factories/generators: none — read-only module, no data created.
- Types: none.

## Test data
No generated data. The spec reads whatever employee record is currently linked
to the logged-in Admin account on the shared instance. The Employee Id value is
asserted as "present and non-empty" (`/\S+/`), never a literal value, since the
linked record can be edited by other concurrent users at any time (observed
directly during verification: the linked employee's name, Employee Id, and
even the First/Last Name fields changed between two runs seconds apart — once
showing an employee named "5TVicUic0 Alodah" with Employee Id `78470`, another
run showing "John Doe" with Employee Id `55555` and, at one point, an empty
First Name field).

## Lifecycle and cleanup
Read-only — no create/verify/delete sequence. The spec only opens the page and
asserts real, specific content is visible (see §7).

## Automated coverage
See `docs/TEST_CATALOG.md`. This module's scenario:
- "shows the logged-in user's own Personal Details with real employee content" —
  `@smoke @ui` (`test.describe('My Info - View Personal Details', ...)`).

## Run
```bash
npx playwright test src/modules/my-info/tests
```

## Known limitations
- **Admin is linked to a real PIM employee record** on this shared instance (it
  is not an unlinked/empty state) — `/pim/viewMyDetails` redirects to a
  concrete `empNumber`, and the Personal Details form renders with that
  employee's actual data.
- The page's breadcrumb literally reads **"PIM"**, not "My Info" — OrangeHRM
  reuses the PIM employee-profile breadcrumb for this route since
  `viewMyDetails` redirects into `viewPersonalDetails`. `waitForLoaded()` is
  anchored on that real breadcrumb text plus the "Personal Details" heading,
  per this module's own actual rendering (not an assumption).
- The "Employee Id" input has no accessible label/role name in OrangeHRM's
  markup (the visible "Employee Id" text is a sibling node, not a `<label>`),
  so the page object resolves it via its `.oxd-input-group` wrapper's visible
  text, per the selector policy fallback order (`docs/ARCHITECTURE.md` §5).
- The Employee Full Name (First/Last Name) inputs are asserted **visible only**,
  not for a non-empty value — because this is a shared public instance where
  other concurrent users can (and did, during verification) clear the linked
  record's name at any time; Employee Id was the one field observed to
  reliably carry a real, non-empty value for this account.
- No field is edited and no Save button on this page is clicked — intentional,
  per Scope.
