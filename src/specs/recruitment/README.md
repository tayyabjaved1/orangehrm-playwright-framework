# Recruitment

## Scope
Covers the Candidates workflow of the Recruitment module: adding a candidate
through the real Add Candidate form, finding it in the Candidates list, and
deleting it. Coverage is **mutating-and-self-cleaning** (see
`docs/ARCHITECTURE.md` §7) — the one spec in this module creates a candidate,
verifies it, deletes it, and verifies it's gone, all inside a single test, so
no data this suite creates is left behind on the shared instance.

## Navigation
- Entry route(s): `/web/index.php/recruitment/viewRecruitmentModule` (Candidates
  list), `/web/index.php/recruitment/addCandidate` (Add Candidate form, which
  becomes the new candidate's own detail/"Application Stage" page once saved).
- Preconditions: logged in as Admin via the shared `storageState` — no
  module-specific precondition.
- Required role/account: Admin (the shared `ADMIN_USERNAME`/`ADMIN_PASSWORD`).

## Architecture
- Page Objects:
  - `CandidateListPage` (`pages/candidate-list.page.ts`) — extends `BasePage`;
    `waitForLoaded()` anchors on the `Candidates` heading.
  - `AddCandidatePage` (`pages/add-candidate.page.ts`) — extends `BasePage`;
    `waitForLoaded()` anchors on the `Add Candidate` heading.
- Factories/generators: `CandidateFactory` (`data/factories/candidate.factory.ts`),
  built on `CommonGenerator`.
- Types: `CandidateData` (`data/types/recruitment.types.ts`).

## Test data
`CandidateFactory.create()` generates:
- `firstName` — via `CommonGenerator.username('candidate')`, **not**
  `CommonGenerator.firstName()`. The Candidates list's name search is a
  type-ahead that matches by first-name prefix only (verified live), and this
  long-lived shared instance already carries many candidates with ordinary
  faker first names (several "John Doe" entries, for example) — a plain faker
  first name risks matching more than one existing record. The
  collision-resistant `username()` suffix guarantees a spec's search always
  resolves to exactly the one row it created.
- `lastName` — `CommonGenerator.lastName()` (plain faker; only `firstName` is
  load-bearing for search uniqueness).
- `email` — `CommonGenerator.email()` (unique per call).

No static/reference data is depended on: Vacancy and Resume are both optional
on the Add Candidate form (verified live — Vacancy's label carries no
"required" asterisk, and the Resume upload has no required marker), so the
spec leaves both unset rather than inventing a vacancy name.

## Lifecycle and cleanup
The one spec (`tests/candidate.spec.ts`) runs the full create → verify →
delete → verify-gone sequence in its own steps, no separate hook:
1. Add the candidate via the real form.
2. Verify the "Successfully Saved" toast and the new candidate's own detail
   page (heading "Application Stage") showing its generated full name.
3. Search the Candidates list by the generated first name, select the matching
   suggestion, submit the search.
4. Verify exactly one row matches.
5. Select that row's checkbox and delete it, confirming the dialog.
6. Verify the "Successfully Deleted" toast.
7. Search again by the same first name.
8. Verify the name search now reports "No Records Found" — a deleted
   candidate's name no longer resolves to any selectable suggestion at all,
   which is the live, falsifiable signal this suite uses instead of relying on
   the list grid (searching the grid itself requires selecting a real
   suggestion first, which a deleted candidate can no longer provide).

## Automated coverage
See `docs/TEST_CATALOG.md`. One scenario in this module:
- "adds a candidate, finds it in the list, then deletes it" —
  `@smoke @ui` (`test.describe('Recruitment - Add Candidate', ...)`).

## Run
```bash
npx playwright test src/specs/recruitment
```

## Known limitations
- The Email input and the Vacancy/Contact Number/Resume fields on the Add
  Candidate form carry no accessible label/name of their own (a styled
  `<label>` sits beside each `<input>` with no `for`/`id` association) — the
  page object locates Email via a documented CSS fallback: the `.oxd-input-group`
  that contains the literal "Email" label text, per `docs/ARCHITECTURE.md` §5.
- The row checkbox's real `<input type="checkbox">` is visually covered by a
  custom icon overlay that intercepts pointer events — the page object clicks
  the `.oxd-checkbox-input` wrapper instead of the input itself, a documented
  CSS fallback for the same reason.
- Vacancy and Resume upload are not exercised — both are optional on this form
  and the brief for this module explicitly avoids inventing a vacancy name
  that doesn't exist on the shared instance.
