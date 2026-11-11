# Documentation as Code Policy

Documentation is maintained as part of the product, not a one-time handover. A
change is not complete until the relevant docs describe the new behavior.

## Source of truth

- Executable behavior and types are authoritative for implementation details.
- `docs/` explains architecture, conventions, and coverage.
- Each module's section in `docs/MODULE_CATALOG.md` describes that module's
  scope, data, and limits — centralized, not one README per module (matching
  core-pw-e2e-tests' approach).
- `docs/TEST_CATALOG.md` and `docs/TRACEABILITY.md` describe current automated
  scenarios. A removed test is removed from both in the same change.
- `docs/CHANGELOG.md` records notable framework/coverage changes.

## Required update matrix

| Change | Required documentation |
|---|---|
| New/changed/removed spec | `docs/TEST_CATALOG.md`, `docs/TRACEABILITY.md`, that module's section in `docs/MODULE_CATALOG.md` |
| New/changed/removed factory/generator/type | `docs/DATA_FACTORY_GUIDE.md`, `docs/FACTORY_CATALOG.md` |
| New/changed/removed module or page object | `docs/MODULE_CATALOG.md` (summary table row + module section) |
| Playwright/npm/env/CI configuration change | `README.md`, `docs/CONFIGURATION.md` |
| Architecture/core change | `docs/ARCHITECTURE.md` |

## Pull request workflow

1. Update implementation and tests together.
2. Update every documentation file the change matrix requires.
3. Update `docs/TEST_CATALOG.md` / `docs/TRACEABILITY.md` for any added, changed,
   or removed scenario.
4. Add a `docs/CHANGELOG.md` entry for a meaningful change.
5. Run `npm run typecheck`, the relevant tests, and `npm run docs:check`.

## Quality rules

- Never claim a test is implemented unless its spec exists and passes.
- Keep coverage status explicit: `Implemented`, `Planned`, or `Read-only (by design)`.
- A module whose mutating action is intentionally left undriven (see
  `docs/ARCHITECTURE.md` §7) states that in its `docs/MODULE_CATALOG.md`
  section — not silently omitted.
