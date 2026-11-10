# Changelog

Notable framework changes are recorded here.

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
