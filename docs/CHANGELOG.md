# Changelog

Notable framework changes are recorded here.

## 0.3.1 - Centralized module docs (matching core-pw-e2e-tests)

- Removed all 13 per-module `README.md` files. That pattern came from
  demoqa-playwright-framework's own convention, not core-pw-e2e-tests, which
  centralizes everything in a handful of `docs/*.md` files with no per-module
  READMEs. Folded every module's content (scope, navigation, architecture,
  test data, lifecycle, known limitations) into one section per module in
  `docs/MODULE_CATALOG.md`, under its existing summary table.
- Replaced `docs/templates/MODULE_README.template.md` with
  `docs/templates/MODULE_SECTION.template.md` — a template for adding a new
  module's section to `MODULE_CATALOG.md`, not a standalone file.
- Updated every doc/code reference that pointed at a per-module README
  (`docs/ARCHITECTURE.md`, `docs/DOCUMENTATION_POLICY.md`,
  `docs/CHANGE_IMPACT_MATRIX.md`, `scripts/check-docs-changes.mjs`, `README.md`,
  `CONTRIBUTING.md`, and inline code comments in 6 page objects/specs).
- Verified: `npm run typecheck` clean; full suite 14/15 passing (the one
  failure is the same pre-existing Leave-module live-site flakiness already
  documented, unrelated to this change).

## 0.3.0 - Layer-first directory structure

- Restructured from module-first (`src/modules/<module>/{pages,tests}`) to
  layer-first (`src/pages/<module>/`, `src/specs/<module>/`), matching
  core-pw-e2e-tests' actual directory convention — a single top-level folder
  per layer, module as the subfolder inside it.
- Each module's `README.md` now lives under `src/specs/<module>/` (every
  module has specs; not every module has page objects).
- `playwright.config.ts`'s `chromium-auth`/`chromium` project `testMatch`/
  `testIgnore` patterns updated to `**/specs/auth/**/*.spec.ts`.
- Updated every relative import (13 modules, ~45 files), `scripts/check-docs-changes.mjs`'s
  path patterns, and all docs/READMEs referencing the old paths.
- Migration: any external reference to `src/modules/<module>/pages` or
  `src/modules/<module>/tests` must be updated to `src/pages/<module>` /
  `src/specs/<module>` respectively.
- Verified: `npm run typecheck` clean. Full suite runs showed the same
  pre-existing live-site flakiness documented in §9 (different modules
  failing on different runs, same error signatures as before this change) —
  no new failures, no path/import-related breakage in any run.

## 0.2.0 - Full module coverage

- Implemented the remaining 11 OrangeHRM modules: Admin, PIM, Leave, Time,
  Recruitment, My Info, Performance, Directory, Maintenance, Claim, Buzz —
  13 modules total alongside Auth and Dashboard, 14 scenarios.
- Mutating modules (Admin, PIM, Leave, Recruitment) are self-cleaning:
  create → verify → delete/cancel → verify-gone, all inside one test, per
  `docs/ARCHITECTURE.md` §7.
- Modules with no safe undo on this shared public instance (Time, My Info,
  Performance, Maintenance, Claim, Buzz) are intentionally read-only, verifying
  real page content rather than performing the mutating action. Maintenance in
  particular stops at the Administrator Access credential gate and never
  proceeds into the Purge Employee Records screen behind it.
- Added `src/data/factories/{user,employee,candidate,leave}.factory.ts` and
  matching `src/data/types/<module>.types.ts` files.
- Fixed a real bug found by a clean full-suite run: `BuzzPage.expectFeedContentVisible()`
  assumed the shared feed always has at least one post; it now accepts either a
  real post or the newsfeed's own empty state, since the feed's content changes
  with other users' activity on this shared instance.
- Verified: `npm run typecheck` clean; two consecutive full-suite runs, 15/15
  passing (14 spec tests + the auth `setup` project), against the live site.

## 0.1.0 - Initial framework

- Scaffolded the framework: `core/` (env reader, `BasePage` readiness contract),
  `data/generators` + `data/factories` + `data/types`, one `src/modules/<module>/`
  folder per OrangeHRM module.
- `playwright.config.ts`: a `setup` project logs in once via the real UI and
  saves `storageState`; every module except Auth reuses it — no per-test login.
- Implemented Auth (login/logout, invalid-credentials error) and Dashboard
  (key widgets) as the reference modules.
- Added the full documentation-as-code governance set (architecture, test
  authoring guide, module/factory catalogs, traceability, change-impact matrix,
  docs-check CI gate, PR template, module README template) carried over from
  the demoqa-playwright-framework pattern, combined with core-pw-e2e-tests'
  spec-authoring rigor (named `test.step`s, no raw selectors, assert-real-behaviour,
  self-cleaning data for a shared public instance with no per-run tenant).
