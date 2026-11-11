# Module Catalog

Only modules with code in the repository are marked `Implemented`. A module
intentionally left read-only (see `docs/ARCHITECTURE.md` §7) is still
`Implemented` — its section below states the read-only scope explicitly.
Centralized here rather than one `README.md` per module, matching
core-pw-e2e-tests' approach (a handful of `docs/*.md` files, no per-module
READMEs).

| Module | Route (as entered) | Coverage | Status |
|---|---|---|---|
| [Auth](#auth) | `/web/index.php/auth/login` | Valid login lands on dashboard; invalid password shows error | Implemented |
| [Dashboard](#dashboard) | `/web/index.php/dashboard/index` | Key widgets visible after login | Implemented |
| [Admin](#admin) | `/web/index.php/admin/viewAdminModule` | Add a system user, verify in grid, delete | Implemented |
| [PIM](#pim) | `/web/index.php/pim/viewPimModule` | Add an employee, verify, delete | Implemented |
| [Leave](#leave) | `/web/index.php/leave/viewLeaveModule` | Grant entitlement, apply for leave, verify Pending Approval, cancel, verify Cancelled | Implemented |
| [Time](#time) | `/web/index.php/time/viewTimeModule` → redirects to `viewEmployeeTimesheet` | Timesheets landing page loads with Select Employee + Pending Action grid (read-only) | Implemented |
| [Recruitment](#recruitment) | `/web/index.php/recruitment/viewRecruitmentModule` | Add a candidate, verify, delete | Implemented |
| [My Info](#my-info) | `/web/index.php/pim/viewMyDetails` | Logged-in user's own Personal Details load (Employee Id verified; read-only) | Implemented |
| [Performance](#performance) | `/web/index.php/performance/viewPerformanceModule` → redirects to `searchEvaluatePerformanceReview` | Reviews grid columns / empty state verified (read-only) | Implemented |
| [Directory](#directory) | `/web/index.php/directory/viewDirectory` | Search the employee directory, verify real results or empty state | Implemented |
| [Maintenance](#maintenance) | `/web/index.php/maintenance/viewMaintenanceModule` → redirects straight to the Purge Employee credential gate | Administrator Access gate verified only — never proceeds past it (read-only, safety-critical) | Implemented |
| [Claim](#claim) | `/web/index.php/claim/viewClaimModule` → redirects to `viewAssignClaim` | Employee Claims list/grid/Assign Claim button verified (read-only) | Implemented |
| [Buzz](#buzz) | `/web/index.php/buzz/viewBuzz` | Feed + composer verified; accepts either a real post or the empty state (read-only, no post created) | Implemented |

## Module conventions

Each module keeps its own Page Objects under `src/pages/<module>/` and its
specs under `src/specs/<module>/` — layer-first, matching core-pw-e2e-tests'
directory convention. Factories/types (only when a module creates domain
data) live in the shared `src/data/`. Add a section below (copy the structure
of an existing one) when a module is introduced — see
`docs/templates/MODULE_SECTION.template.md`.

## Notes from the first full build-out

- Several modules redirect from their nav-menu route to a more specific one
  (Time, Performance, Claim, Maintenance) — each module's section below
  documents the real landing route verified live, not the nav entry point alone.
- This is a single shared public instance: My Info's linked employee record and
  Directory's search results change between runs as other users interact with
  the same instance concurrently — both specs assert on stable, structural
  signals (e.g. Employee Id presence, "a result or an empty state") rather than
  specific values that could be true one run and false the next.

---

## Auth

**Scope.** The login form itself: valid credentials reach the dashboard; an
invalid password is rejected with a visible error. Read-only by nature —
logging in creates no durable data.

**Navigation.** `/web/index.php/auth/login`. No preconditions — this is the
one module that must **not** start pre-authenticated (see `docs/ARCHITECTURE.md`
§3). Account: `ADMIN_USERNAME`/`ADMIN_PASSWORD` from `.env`.

**Architecture.** Page Object: `pages/login.page.ts` (`LoginPage`) — extends
`BasePage`, `waitForLoaded()` anchored on the `Login` heading. No
factories/types.

**Test data.** None generated — both scenarios use the real
`ADMIN_USERNAME`/`ADMIN_PASSWORD` (valid case) or a deliberately wrong
password literal (invalid case).

**Lifecycle.** Nothing persisted. No teardown.

**Coverage** (`src/specs/auth/login.spec.ts`): valid login reaches the
dashboard; invalid password shows an error with no navigation — both `@smoke @ui`.

**Known limitations.** Only the login form is covered — "Forgot your
password?" and logout are not yet automated. This spec runs in the
`chromium-auth` Playwright project (no `storageState`) — don't move it into
the shared `chromium` project.

## Dashboard

**Scope.** The post-login landing page. Read-only by design — it only
aggregates other modules' data; nothing here to create or clean up.

**Navigation.** `/web/index.php/dashboard/index`. Logged in via shared
`storageState` (see §3). No module-specific precondition.

**Architecture.** Page Object: `pages/dashboard.page.ts` (`DashboardPage`) —
extends `BasePage`, `waitForLoaded()` anchored on the `Dashboard` breadcrumb;
also exposes `openModule(name)` for other page objects to navigate via the
sidebar. No factories/types.

**Test data.** None.

**Lifecycle.** Nothing persisted. No teardown.

**Coverage** (`src/specs/dashboard/dashboard.spec.ts`): key widgets ("Time at
Work", "My Actions", "Quick Launch") visible after login — `@smoke @ui`.

**Known limitations.** Doesn't assert on widget *content* (e.g. actual
leave/attendance numbers) — those are shared-instance data that changes
constantly; only presence of the widgets themselves is verified.

## Admin

**Scope.** The Admin module's **System Users** feature: adding a new system
user and removing it again. **Mutating-and-self-cleaning** (§7) — the spec
creates a uniquely-named user, verifies it in the grid, then deletes it and
verifies it's gone, all within the same test.

**Navigation.** `/web/index.php/admin/viewSystemUsers` (list),
`/web/index.php/admin/saveSystemUser` (Add User form). Logged in via shared
`storageState`. Account: Admin.

**Architecture.**
- `AddUserPage` (`src/pages/admin/add-user.page.ts`) — extends `BasePage`;
  `waitForLoaded()` anchors on the `Add User` heading directly (this page's
  breadcrumb renders only the "Admin" module crumb, no second-level crumb).
- `SystemUserListPage` (`src/pages/admin/system-user-list.page.ts`) — extends
  `BasePage`; `waitForLoaded()` anchors on `breadcrumb('User Management')`.
- `UserFactory` (`src/data/factories/user.factory.ts`); type
  `SystemUserData` (`src/data/types/admin.types.ts`).

**Test data.** `UserFactory.create()` generates a fresh `username` (via
`CommonGenerator.username('user')`, collision-resistant across concurrent
runs) and `password`. `role` is fixed to `'ESS'`, Status fixed to `Enabled`.
Employee Name is **not** factory-generated — it's a live autocomplete over
real PIM employees, so the spec types a common letter (`"a"`) and accepts the
dropdown's first real suggestion.

**Lifecycle.** 1) Add the user, verify the success toast. 2) Search the list
by the generated username, verify exactly one row. 3) Select and delete it,
confirming the dialog. 4) Search again, verify no matching rows.

**Coverage** (`src/specs/admin/system-users.spec.ts`): "adds a system user,
verifies it in the grid, and deletes it" — `@smoke @ui`.

**Known limitations.**
- Documented CSS fallbacks (no role/label/text available): User Role/Status
  dropdown triggers (scoped via `.oxd-input-group` label text; opened options
  are real `option` roles); the Employee Name autocomplete's suggestion list;
  Username/Password/Confirm Password inputs (scoped by field label); grid rows
  and the row checkbox (its check-icon overlays the input, requiring a forced
  click).
- Live-site quirk: saving the Add User form does **not** redirect back to the
  list (unlike PIM's Add Employee) — it stays on the form with a success
  toast, so the spec explicitly re-opens the list afterward.
- Only System Users is covered — no other Admin sub-features (Job,
  Organization, Qualifications, etc.).

## PIM

**Scope.** The PIM module's Employee Information: adding an employee and
managing it in the Employee List. **Mutating-and-self-cleaning** (§7).

**Navigation.** `/web/index.php/pim/viewPimModule` (list),
`/web/index.php/pim/addEmployee` (Add Employee),
`/web/index.php/pim/viewPersonalDetails/empNumber/{id}` (reached only via Add
Employee). Logged in via shared `storageState`. Account: Admin.

**Architecture.**
- `AddEmployeePage` (`src/pages/pim/add-employee.page.ts`) — `waitForLoaded()`
  anchors on the "Add Employee" heading (the PIM breadcrumb reads just "PIM"
  on every route and can't distinguish them).
- `EmployeeListPage` (`src/pages/pim/employee-list.page.ts`) — anchors on
  "Employee Information" heading.
- `EmployeeDetailsPage` (`src/pages/pim/employee-details.page.ts`) — anchors
  on the URL pattern `/pim/viewPersonalDetails/empNumber/\d+` plus "Personal
  Details" heading; only ever reached via `AddEmployeePage.submit()`'s
  redirect, so specs call `waitForLoaded()` directly, never `open()`.
- `EmployeeFactory` (`src/data/factories/employee.factory.ts`); type
  `EmployeeData` (`src/data/types/pim.types.ts`).

**Test data.** `EmployeeFactory.create(overrides?)` returns a fresh
`{ firstName, lastName }` via Faker each call. OrangeHRM's auto-filled
Employee Id is left untouched — the full name is used to find/delete instead.

**Lifecycle.** 1) Add via `AddEmployeePage.submit()`. 2) Verify the resulting
Personal Details page shows the generated name. 3) Verify it appears exactly
once in the Employee List. 4) Delete via row checkbox + "Delete Selected" +
confirm. 5) Verify the live-search suggestion list reports "No Records Found."

**Coverage** (`src/specs/pim/add-employee.spec.ts`): "adds an employee,
verifies it in the list, then deletes it" — `@regression @ui`.

**Known limitations.**
- Only Add Employee → verify → delete is implemented; other PIM sub-features
  (Reports, bulk actions, editing other detail tabs) are out of scope.
- `EmployeeListPage`'s name filter uses a documented CSS fallback
  (`.oxd-input-group` containing "Employee Name") since that field and
  "Supervisor Name" share a placeholder and no `<label>` is wired via `for`/`id`.
- `deleteEmployee()` clicks `.oxd-checkbox-input-icon` (documented fallback) —
  a custom icon overlays the real checkbox input and intercepts the click.
- The Employee Name filter is an autocomplete bound to a selected suggestion,
  not raw typed text — `searchByName()` always selects the suggestion first;
  `expectEmployeeNotListed()` asserts on the suggestion list's own "No Records
  Found" state instead, since a deleted employee has no suggestion left.

## Leave

**Scope.** The employee self-service leave journey: apply, verify in My
Leave, cancel. **Mutating-and-self-cleaning** (§7) — every leave request
created is cancelled before the test ends; the one additional mutation
(granting a leave entitlement, see Known limitations) only ever adds balance
to Admin's own employee record, never touches another employee, and isn't
destructive.

**Navigation.** `/web/index.php/leave/viewLeaveModule` (Leave List for
Admin), `/web/index.php/leave/applyLeave`, `/web/index.php/leave/viewMyLeaveList`,
`/web/index.php/leave/addLeaveEntitlement`. Account: Admin's own employee
record, `John Mike Doe` (verified live via My Info, empNumber 7 — the
topbar's "John Doe" label is a truncated display of the same employee).

**Architecture.**
- `ApplyLeavePage` (`src/pages/leave/apply-leave.page.ts`) — anchors on
  "Apply Leave" heading.
- `MyLeavePage` (`src/pages/leave/my-leave.page.ts`) — anchors on "My Leave
  List" heading.
- `AddLeaveEntitlementPage` (`src/pages/leave/add-leave-entitlement.page.ts`)
  — anchors on the `Leave` breadcrumb plus the page's own "Add Leave
  Entitlement" text (renders as a plain `<p>`, not a heading role).
- `LeaveFactory` (`src/data/factories/leave.factory.ts`); type
  `LeaveApplicationData` (`src/data/types/leave.types.ts`).

**Test data.** `LeaveFactory.create()` returns `{ fromDate, toDate, comment }`:
a single-day request with a randomized (not fixed) offset within the current
calendar year — avoids tripping "Overlapping Leave Request" against concurrent
runs, and stays within the entitlement's valid period. `comment` is
`QE automated leave request <unique token>`, used to find the exact request
later (the list has no comment search field). The leave type applied is
always whichever is first in the dropdown — never hardcoded.

**Lifecycle.** 1) Grant a leave entitlement (precondition, see below). 2)
Verify granted. 3) Apply for leave. 4) Verify submitted. 5) Verify
`Pending Approval` in My Leave, found by the comment token. 6) Cancel via the
row's own action. 7) Verify status is now `Cancelled` — OrangeHRM doesn't
delete a cancelled request, it changes status and the record stays listed.
The entitlement itself isn't revoked at the end — additive balance only,
never destructive.

**Coverage** (`src/specs/leave/leave.spec.ts`): "applies for leave, verifies
it in My Leave, then cancels it" — `@smoke @ui`.

**Known limitations.**
- **Zero starting leave balance** (live-site quirk): Admin/`John Mike Doe`
  carries zero balance for every leave type, so Apply Leave shows no form at
  all until a balance exists — the spec grants itself one first.
- **Masked date inputs are unreliable to type into** (live-site quirk): both
  `fill()` and fast typing intermittently garble the value — `ApplyLeavePage`
  drives the calendar-picker UI directly (icon → month dropdown → day cell)
  instead, the one raw-CSS fallback in this module beyond field-group lookups.
- **The Apply button occasionally has no effect on the first click**
  (live-site quirk): `apply()` retries up to three times until the success
  toast appears.
- Every form field in this module has a visible `<label>` with no
  `for`/`id`/wrapping relationship to its input — fields are located via their
  label's enclosing `.oxd-input-group` text container.

## Time

**Scope.** The Time module's landing page — "Employee Timesheets". **Read-only**
(§7): submitting/approving/rejecting a timesheet mutates durable shared data
with no safe undo, so this suite only verifies the page loads with real content.

**Navigation.** `/web/index.php/time/viewTimeModule` → redirects to
`/web/index.php/time/viewEmployeeTimesheet` (breadcrumb "Time" > "Timesheets").
Logged in via shared `storageState`. Account: Admin.

**Architecture.** `EmployeeTimesheetsPage` (`pages/employee-timesheets.page.ts`)
— anchors on the `Timesheets` breadcrumb entry. No factories/types.

**Test data.** None generated. The "Records Found" count is asserted as a
pattern (`/\(\d+\) Records? Found/`), never a literal number.

**Lifecycle.** Read-only — no create/verify/delete sequence.

**Coverage** (`src/specs/time/employee-timesheets.spec.ts`): "shows the
timesheets landing page with pending-action content" — `@smoke @ui`.

**Known limitations.**
- The landing page is **not** the "My Timesheets" day-grid a generic reading
  of the module name implies — Admin lands on "Employee Timesheets," a
  "Select Employee" lookup plus a "Timesheets Pending Action" table of other
  employees' submitted timesheets. No current-period date range exists on
  this page; that only appears after opening an individual timesheet's "View"
  action, which this suite intentionally doesn't drive.
- The "Employee Name" input has no `<label>`/`aria-labelledby` association —
  resolved via `getByPlaceholder('Type for hints...')` instead of `getByLabel`.
- Submitting/viewing/approving/rejecting any timesheet is intentionally left
  undriven.

## Recruitment

**Scope.** The Candidates workflow: add via the real form, find in the list,
delete. **Mutating-and-self-cleaning** (§7).

**Navigation.** `/web/index.php/recruitment/viewRecruitmentModule` (list),
`/web/index.php/recruitment/addCandidate` (form, becomes the candidate's own
detail/"Application Stage" page once saved). Account: Admin.

**Architecture.**
- `CandidateListPage` (`pages/candidate-list.page.ts`) — anchors on
  "Candidates" heading.
- `AddCandidatePage` (`pages/add-candidate.page.ts`) — anchors on "Add
  Candidate" heading.
- `CandidateFactory` (`data/factories/candidate.factory.ts`); type
  `CandidateData` (`data/types/recruitment.types.ts`).

**Test data.** `firstName` is built from `CommonGenerator.username('candidate')`
— **not** a plain Faker first name — because the Candidates search is a
type-ahead matching by first-name prefix only, and this long-lived shared
instance already carries many candidates with ordinary names (several "John
Doe" entries). The collision-resistant suffix guarantees the search always
resolves to exactly one row. `lastName`/`email` are plain Faker. Vacancy and
Resume are both optional (verified live — no required markers), so left unset.

**Lifecycle.** 1) Add the candidate. 2) Verify the "Successfully Saved" toast
and the detail page ("Application Stage") showing the generated name. 3)
Search by first name, select the matching suggestion, submit. 4) Verify
exactly one row. 5) Delete via checkbox + confirm. 6) Verify "Successfully
Deleted" toast. 7) Search again. 8) Verify the name search now reports "No
Records Found" — the live, falsifiable signal used instead of the grid
itself (which requires selecting a real suggestion a deleted candidate no
longer has).

**Coverage** (`src/specs/recruitment/candidate.spec.ts`): "adds a candidate,
finds it in the list, then deletes it" — `@smoke @ui`.

**Known limitations.**
- Email and the Vacancy/Contact Number/Resume fields carry no accessible
  label — Email is located via a documented CSS fallback (`.oxd-input-group`
  containing the "Email" label text).
- The row checkbox's real input is visually covered by a custom icon overlay
  that intercepts pointer events — the page object clicks the
  `.oxd-checkbox-input` wrapper instead.
- Vacancy and Resume upload are not exercised — both optional, and this
  module avoids inventing a vacancy name that doesn't exist on the instance.

## My Info

**Scope.** The My Info landing page — "Personal Details" for the logged-in
user's own employee record. **Read-only** (§7): no field is edited, no Save
is clicked.

**Navigation.** `/web/index.php/pim/viewMyDetails` → redirects to
`/web/index.php/pim/viewPersonalDetails/empNumber/<n>` (breadcrumb "PIM" >
"Personal Details"). Account: Admin.

**Architecture.** `PersonalDetailsPage` (`pages/personal-details.page.ts`) —
anchors on the `PIM` breadcrumb plus the "Personal Details" heading and the
Employee Id input (the heading renders before the form's own AJAX load
finishes). No factories/types.

**Test data.** None generated. The Employee Id value is asserted as "present
and non-empty" (`/\S+/`), never a literal value — the linked record can be
edited by other concurrent users at any time (observed directly: the linked
employee's name, Employee Id, and even First/Last Name fields changed between
two runs seconds apart).

**Lifecycle.** Read-only — no create/verify/delete sequence.

**Coverage** (`src/specs/my-info/my-info.spec.ts`): "shows the logged-in
user's own Personal Details with real employee content" — `@smoke @ui`.

**Known limitations.**
- Admin **is** linked to a real PIM employee record on this instance (not an
  unlinked/empty state).
- The breadcrumb literally reads "PIM", not "My Info" — OrangeHRM reuses the
  PIM employee-profile breadcrumb since `viewMyDetails` redirects into
  `viewPersonalDetails`.
- "Employee Id" has no accessible label (the visible text is a sibling node,
  not a `<label>`) — resolved via its `.oxd-input-group` wrapper's visible text.
- The Full Name inputs are asserted **visible only**, not for a non-empty
  value — other concurrent users can (and did, during verification) clear the
  linked record's name; Employee Id was the one field reliably non-empty.

## Performance

**Scope.** The Performance module's review search/management screen.
**Read-only** (§7): starting/saving a review mutates durable shared data with
no safe undo.

**Navigation.** `/web/index.php/performance/viewPerformanceModule` →
redirects to `/web/index.php/performance/searchEvaluatePerformanceReview`
("Manage Reviews" / "Employee Reviews"). No separate overview page. Account:
Admin.

**Architecture.** `ManageReviewsPage` (`pages/manage-reviews.page.ts`) —
anchors on the `Manage Reviews` breadcrumb plus the "Employee Reviews" (level
5) heading. No factories/types.

**Test data.** None generated. Grid column headers (Employee, Job Title, Sub
Unit, Review Period, Due Date, Review Status, Actions) are fixed, static UI.

**Lifecycle.** Read-only — nothing created, nothing to delete.

**Coverage** (`src/specs/performance/performance.spec.ts`): opens the
module, verifies the grid's column headers and its "No Records Found"
empty-state message (the instance currently has no reviews configured) —
`@smoke @ui`.

**Known limitations.**
- No raw CSS fallback needed — breadcrumb, heading, column headers, and
  empty-state message are all reachable via `getByRole`/`getByText`.
- The "No Records Found" assertion is literal to the instance's state at
  writing time — if another user creates a review, this would show rows
  instead and the assertion would need updating; there's no API to reset
  this shared instance.
- Starting/saving/submitting a review is intentionally not driven.

## Directory

**Scope.** Searching the employee Directory by name and verifying real
results render. **Read-only** (§7) — a GET-style query, creates nothing.

**Navigation.** `/web/index.php/directory/viewDirectory`. Account: Admin.

**Architecture.** `DirectoryPage` (`src/pages/directory/directory.page.ts`)
— anchors on the `Directory` breadcrumb. No factories/types (searching
doesn't create data).

**Test data.** None generated. The spec searches using a broad common letter
(`'a'`) rather than any specific employee's name, since the directory's
contents are real PIM employees added/removed by other concurrent users and
change over time. Assertions target the *shape* of the response (a result
card with a visible name, or "No Records Found") rather than a specific
employee.

**Lifecycle.** Read-only — no record created, nothing to delete.

**Coverage** (`src/specs/directory/directory.spec.ts`): search by a common
name fragment, verify results render — `@smoke @ui`.

**Known limitations.**
- The Employee Name autocomplete only actually filters once a suggestion is
  *selected* — free-typed text alone isn't applied server-side.
  `searchByName()` selects the first real suggestion before submitting.
- The result card's name text exposes no accessible role/label of its own —
  `.orangehrm-directory-card`/`-header` is a documented CSS fallback.
- Job title is not asserted — several employees have no job title set, which
  would make that assertion flaky independent of any real regression; the
  name is asserted instead (every record has one).

## Maintenance

**Scope.** The Maintenance module's entry point: the "Administrator Access"
credential-confirmation gate. **Read-only, safety-critical** (§7). Unlike
other modules, it isn't read-only merely because its journey creates/cleans
up data elsewhere — it never gets past the gate at all. On this instance the
route redirects straight into Purge Employee Records, and confirming the gate
lands directly on that destructive, no-safe-undo page with no intermediate
safe sub-page. This module verifies the gate itself and stops there.

**Navigation.** `/web/index.php/maintenance/viewMaintenanceModule` →
redirects to `/maintenance/purgeEmployee`, intercepted by the "Administrator
Access" gate before any content renders. Account: Admin (the only account
that can reach Maintenance).

**Architecture.** `MaintenancePage` — `waitForLoaded()` anchors on
`getByRole('heading', { name: 'Administrator Access' })`, not the shared
`breadcrumb()` helper, because this route renders no
`.oxd-topbar-header-breadcrumb` at all (a standalone full-screen form). No
factories/types.

**Test data.** None generated. The spec reads `ADMIN_USERNAME`/
`ADMIN_PASSWORD` via `requireEnv` to assert the gate's disabled username
field shows the real authenticated account, and fills the real password into
the password field to exercise that interaction — without ever submitting it.

**Lifecycle.** Read-only — the test never clicks "Confirm," which would
submit the credential check and land on Purge Employee Records.

**Coverage** (`src/specs/maintenance/maintenance.spec.ts`): "shows the
administrator access confirmation gate for the authenticated admin, without
proceeding into any purge action" — `@regression @ui`.

**Known limitations.**
- No sub-page of Maintenance is driven — the only content reachable past the
  gate on this instance is Purge Employee Records, with no alternative safe
  viewer available. The spec stops at verifying the gate: heading,
  explanatory text, pre-filled username, password field, Confirm/Cancel
  buttons. It never clicks Confirm.
- Raw CSS fallback for username/password inputs
  (`input[name="username"]`, `input[name="password"]`): both render as
  `textbox` with no accessible name, and the form has two otherwise identical
  nameless textboxes — a role/label selector can't distinguish them without a
  forbidden positional lookup. The `name` attribute is genuine existing markup.
- If OrangeHRM ever adds a genuinely safe sub-page under Maintenance (e.g. a
  pure audit/login-attempts viewer), this module should be extended to cover it.

## Claim

**Scope.** The Claim module's landing page — the Employee Claims list.
**Read-only** (§7): submitting a claim writes a durable record with no safe
undo, so this module never drives the Assign Claim form.

**Navigation.** `/web/index.php/claim/viewClaimModule` → redirects to
`/web/index.php/claim/viewAssignClaim` (the Employee Claims list). Account: Admin.

**Architecture.** `ClaimPage` (`src/pages/claim/claim.page.ts`) — anchors on
`breadcrumb('Claim')` (the topbar breadcrumb reads "Claim"; "Employee Claims"
is the in-page `<h5>` heading, asserted separately). No factories/types.

**Test data.** None generated. The spec reads only real, already-present
content: the "Employee Claims" heading, the grid's column headers, the "(n)
Records Found" count, and the "Assign Claim" button — all structural/stable
content regardless of which claim records currently exist.

**Lifecycle.** Read-only — the Assign Claim action's presence is verified
without ever clicking it.

**Coverage** (`src/specs/claim/claim.spec.ts`): opens the module, verifies
the Employee Claims heading, grid column headers, records-found count, and
Assign Claim button — `@smoke @ui`.

**Known limitations.**
- No raw-selector fallback needed — every assertion resolves via
  `getByRole`/`getByText`.
- The Assign Claim submission flow is intentionally not driven.
- The grid's specific rows (e.g. sample "John Doe" claims) are real data
  already present and may change or be reset by the demo's maintainers at any
  time — the spec never asserts on specific row content, only structural/stable
  content.

## Buzz

**Scope.** Viewing the Buzz newsfeed: the module loads, the post composer is
present, existing feed content renders. **Read-only** (§7): Buzz posts are
durable and publicly visible to every user of this shared instance, with no
API or UI path to delete one — this module never submits a post, comment,
reaction, or photo/video share.

**Navigation.** `/web/index.php/buzz/viewBuzz`. Account: Admin.

**Architecture.** `BuzzPage` (`pages/buzz.page.ts`) — anchors on the `Buzz`
breadcrumb. No factories/types.

**Test data.** None generated. The spec only reads whatever posts already
exist; it never asserts on specific post text since that content is
free-form and controlled by other users of the shared instance.

**Lifecycle.** Read-only — verifies the composer is present and either a
real post or the "No Posts Available" empty state renders, and ends there.

**Coverage** (`src/specs/buzz/buzz.spec.ts`): "shows the newsfeed with the
post composer and existing feed content" — `@smoke @ui`.

**Known limitations.**
- Does not drive posting, commenting, reacting, or sharing — intentionally
  left undriven per the shared-instance discipline in §7.
- `expectFeedContentVisible()` uses raw CSS class fallbacks
  (`.orangehrm-buzz`, `.orangehrm-buzz-post-body-text`) — individual feed
  posts expose no accessible role or distinguishing label/text.
- Accepts either outcome (a real post or the empty state) since the shared
  feed's content changes with other users' activity in real time — observed
  directly during verification when another user posted mid-test, briefly
  producing both states on screen at once (a transient Playwright strict-mode
  race, not a defect).
