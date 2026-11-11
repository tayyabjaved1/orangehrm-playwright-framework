# <Module Name>

## Scope
What user-visible capability does this module cover? State plainly whether this
module's coverage is **mutating-and-self-cleaning** or **read-only** (see
`docs/ARCHITECTURE.md` §7) and why.

## Navigation
- Entry route(s):
- Preconditions: (logged in as Admin via the shared `storageState` — true for
  every module except Auth; note any module-specific precondition)
- Required role/account:

## Architecture
- Page Objects: (name each; confirm it extends `BasePage` and implements
  `waitForLoaded()` anchored on its own breadcrumb/heading — see
  `docs/ARCHITECTURE.md` §4)
- Factories/generators:
- Types:

## Test data
Describe generated fields, uniqueness guarantees, and any static/reference data
(dropdown values, fixed IDs) the module depends on.

## Lifecycle and cleanup
If this module creates data: describe the create → verify → delete → verify-gone
sequence and confirm it all happens inside the test, not a separate hook. If
read-only: state that explicitly and why (see §7).

## Automated coverage
Link to `docs/TEST_CATALOG.md` and list this module's scenarios, each with its
`test.describe` tag(s) (e.g. `@regression @ui`) — set via Playwright's native
`{ tag: [...] }` option, not embedded in the title string.

## Run
```bash
npx playwright test src/specs/<module>
```

## Known limitations
List unimplemented sub-features, any raw-selector fallback used because an
element has no accessible role/label/text (per `docs/ARCHITECTURE.md` §5) and
why, and any shared-instance risk specific to this module (see §7) — e.g. a
mutating action intentionally left undriven.
