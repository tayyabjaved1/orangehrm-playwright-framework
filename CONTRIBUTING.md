# Contributing

1. Read `docs/ARCHITECTURE.md` and `docs/TEST_AUTHORING_GUIDE.md` first — this
   repo follows those conventions strictly, not as suggestions.
2. One module, two homes: `src/pages/<module>/` (page objects) and `src/specs/<module>/` (specs). Module-level docs (scope, limitations) go in `docs/MODULE_CATALOG.md`, not a per-module README.
3. Every spec's tags use Playwright's native `{ tag: [...] }` option and every
   test is broken into named `test.step()`s — see the Test Authoring Guide.
4. A spec that creates data on the shared demo instance must delete it before
   the test ends, or the module must be documented read-only — see
   `docs/ARCHITECTURE.md` §7.
5. Update the docs the change matrix in `docs/DOCUMENTATION_POLICY.md` requires,
   in the same change.
6. Before opening a PR:
   ```bash
   npm run typecheck
   npx playwright test
   npm run docs:check
   ```
