# Admin

## Scope
Covers the Admin module's **System Users** feature: adding a new system user
through the Add User form and removing it again. This module's coverage is
**mutating-and-self-cleaning** (see `docs/ARCHITECTURE.md` §7) — the one spec
creates a uniquely-named user, verifies it in the grid, then deletes it and
verifies it is gone, all within the same test.

## Navigation
- Entry route(s): `/web/index.php/admin/viewSystemUsers` (System Users list),
  `/web/index.php/admin/saveSystemUser` (Add User form — this is also the
  route OrangeHRM uses for the Add User screen itself, not just the save POST).
- Preconditions: logged in as Admin via the shared `storageState` (true for
  every module except Auth). No module-specific precondition.
- Required role/account: Admin.

## Architecture
- Page Objects:
  - `AddUserPage` (`src/modules/admin/pages/add-user.page.ts`) — extends
    `BasePage`; `waitForLoaded()` anchors on the `Add User` heading directly
    (this page's breadcrumb renders only the "Admin" module crumb, with no
    second-level crumb, so the shared `breadcrumb()` helper doesn't apply here).
  - `SystemUserListPage` (`src/modules/admin/pages/system-user-list.page.ts`)
    — extends `BasePage`; `waitForLoaded()` anchors on
    `this.breadcrumb('User Management')`.
- Factories/generators: `UserFactory` (`src/data/factories/user.factory.ts`),
  built on `CommonGenerator.username()` / `CommonGenerator.password()`.
- Types: `SystemUserData` (`src/data/types/admin.types.ts`).

## Test data
`UserFactory.create()` generates a fresh `username` (via
`CommonGenerator.username('user')`, collision-resistant across concurrent runs
on the shared instance) and `password` (via `CommonGenerator.password()`).
`role` is fixed to `'ESS'` and the form's Status is fixed to `Enabled` — these
don't need to vary per the module's single journey. Employee Name is **not**
factory-generated: it's a live autocomplete over real PIM employees on the
shared demo instance, so the spec types a common letter (`"a"`) and accepts
the dropdown's first real suggestion rather than inventing a name.

## Lifecycle and cleanup
The one spec performs the full create → verify → delete → verify-gone sequence
inside its own `test.step`s, with no separate teardown hook:
1. Add the system user and verify the success toast.
2. Open the System Users list, search by the generated username, and verify
   exactly one row appears.
3. Select that row and delete it, confirming the dialog.
4. Search again by the same username and verify the grid now shows no
   matching rows.

## Automated coverage
See `docs/TEST_CATALOG.md`. Scenario:
- `Admin - System Users` — "adds a system user, verifies it in the grid, and
  deletes it" — `{ tag: ['@smoke', '@ui'] }`

## Run
```bash
npx playwright test src/modules/admin/tests
```

## Known limitations
- **Documented CSS fallbacks** (ARCHITECTURE.md §5 point 4), since OrangeHRM's
  Add User form and System Users grid expose no role/label/text for these:
  - The User Role and Status `oxd-select-text` dropdown triggers have no
    role/label — scoped via their enclosing `.oxd-input-group`'s visible
    label text. Their opened options are real accessible `option` roles, so
    `getByRole('option', ...)` is used to pick a value.
  - The Employee Name autocomplete's suggestion list (`.oxd-autocomplete-option`)
    carries no accessible role.
  - Username, Password, and Confirm Password are plain `<input>`s with no
    `name`, `label`, or `placeholder` association — scoped by their field's
    own visible label text within its `.oxd-input-group`.
  - Grid rows (`.oxd-table-body .oxd-table-card`) and the row checkbox
    (`.oxd-checkbox-input`) have no accessible role/label; the checkbox's
    check-icon visually overlays its input, requiring a forced click.
- **Live-site quirk vs. a typical OrangeHRM "Add" flow**: saving the Add User
  form does **not** redirect back to the System Users list (unlike, e.g.,
  PIM's Add Employee flow) — it stays on the Add User form with a success
  toast. The spec therefore explicitly re-opens the System Users list via
  `SystemUserListPage.open()` after saving, rather than asserting on the
  post-save URL.
- No other Admin sub-features (Job, Organization, Qualifications, etc.) are
  covered — only System Users, per this module's assigned scope.
