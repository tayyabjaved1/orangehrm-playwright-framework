# Maintenance

## Scope
Covers the Maintenance module's entry point: the "Administrator Access"
credential-confirmation gate shown at `/maintenance/viewMaintenanceModule`.
This module is **read-only** (see `docs/ARCHITECTURE.md` §7). Unlike other
modules, it isn't read-only merely because its journeys create and clean up
data elsewhere — it never gets past the gate at all. On this instance, the
Maintenance route redirects straight into Purge Employee Records, and
confirming the gate lands directly on that destructive, no-safe-undo page,
with no intermediate safe sub-page (no sidebar/menu is rendered on the gate
route, and no other Maintenance sub-page is reachable from it). So this
module verifies the gate itself and stops there.

## Navigation
- Entry route(s): `/web/index.php/maintenance/viewMaintenanceModule` (redirects
  to `/maintenance/purgeEmployee`, which OrangeHRM intercepts with the
  "Administrator Access" gate before rendering any content)
- Preconditions: logged in as Admin via the shared `storageState` (true for
  every module except Auth) — no module-specific precondition
- Required role/account: Admin (the only account that can reach Maintenance)

## Architecture
- Page Objects: `MaintenancePage` — extends `BasePage`; `waitForLoaded()`
  anchors on the gate's own `getByRole('heading', { name: 'Administrator
  Access' })`, not the shared `breadcrumb()` helper, because this route
  renders no `.oxd-topbar-header-breadcrumb` at all (it's a standalone
  full-screen form, not the normal authenticated layout).
- Factories/generators: none — this module creates no data.
- Types: none.

## Test data
No generated data. The spec reads `ADMIN_USERNAME`/`ADMIN_PASSWORD` via
`requireEnv` to (a) assert the gate's disabled username field shows the real
authenticated admin account, and (b) fill the real admin password into the
password field to exercise that interaction — without ever submitting it.

## Lifecycle and cleanup
Read-only: no record is created, so there is nothing to delete. The test
performs no mutating action — it never clicks "Confirm," which would submit
the credential check and land on Purge Employee Records.

## Automated coverage
See `docs/TEST_CATALOG.md`. Scenario:
- "shows the administrator access confirmation gate for the authenticated
  admin, without proceeding into any purge action" — `@regression @ui`
  (`test.describe('Maintenance - Administrator Access Gate', ...)`)

## Run
```bash
npx playwright test src/specs/maintenance
```

## Known limitations
- **No sub-page of Maintenance is driven.** The only content reachable past
  the gate on this instance is Purge Employee Records — a destructive,
  non-undoable action on a shared public instance (see
  `docs/ARCHITECTURE.md` §7) — with no alternative safe viewer (e.g. a
  login-attempts/blocked-IP audit list) available from this gate. The spec
  therefore stops at verifying the gate: heading, explanatory text, pre-filled
  username, password field, and `Confirm`/`Cancel` buttons. It never clicks
  `Confirm`.
- **Raw CSS fallback** for the username and password inputs
  (`input[name="username"]`, `input[name="password"]`): both render as
  `textbox` with no accessible name (their sibling `<label>` isn't
  programmatically associated via `for`/`id`), and the form has two otherwise
  identical nameless textboxes, so a role- or label-based selector can't
  distinguish them without resorting to a forbidden positional/`nth` lookup.
  The `name` attribute is genuine markup already present on the live page.
- If OrangeHRM ever adds a genuinely safe, non-destructive sub-page under
  Maintenance (e.g. a pure audit/login-attempts viewer), this module should be
  extended to cover it — see `docs/MODULE_CATALOG.md` for planned scope.
