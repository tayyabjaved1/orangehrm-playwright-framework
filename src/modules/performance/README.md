# Performance

## Scope
The Performance module's review search/management screen. **Read-only** by
design (see `docs/ARCHITECTURE.md` §7): the only meaningful actions available
here are starting/saving an employee performance review, which mutates
durable shared data on the public demo instance with no safe undo and no
API to reset it. This module verifies the page loads and its real grid
content renders; it does not start, save, or submit any review.

## Navigation
- Entry route: `/web/index.php/performance/viewPerformanceModule` — the demo
  instance redirects this to `/web/index.php/performance/searchEvaluatePerformanceReview`
  ("Manage Reviews" / "Employee Reviews" search grid). There is no separate
  "overview" landing page.
- Preconditions: logged in as Admin via the shared `storageState` (see
  `docs/ARCHITECTURE.md` §3) — no module-specific precondition.
- Required role/account: Admin (the shared session); no other role tested.

## Architecture
- Page Objects: `pages/manage-reviews.page.ts` (`ManageReviewsPage`) — extends
  `BasePage`, `waitForLoaded()` anchored on the `Manage Reviews` breadcrumb
  (`this.breadcrumb('Manage Reviews')`) plus the `Employee Reviews` (level 5)
  heading.
- Factories/generators: none — read-only module, nothing to generate.
- Types: none.

## Test data
None generated. The grid's column headers (`Employee`, `Job Title`, `Sub Unit`,
`Review Period`, `Due Date`, `Review Status`, `Actions`) are the shared
instance's fixed, static UI — not data the suite creates.

## Lifecycle and cleanup
Read-only: nothing is created, so there's nothing to delete. The spec only
opens the page and asserts on content already rendered by the shared instance.

## Automated coverage
See `docs/TEST_CATALOG.md`. `src/modules/performance/tests/performance.spec.ts`,
`test.describe('Performance - View Reviews', { tag: ['@smoke', '@ui'] })`:
opens the Performance module, verifies the reviews grid's column headers are
visible, and verifies the grid's "No Records Found" empty-state message is
visible (the shared instance currently has no performance reviews
configured).

## Run
```bash
npx playwright test src/modules/performance/tests
```

## Known limitations
- No selectors required a raw CSS fallback — the breadcrumb, heading, grid
  column headers, and empty-state message are all reachable via
  `getByRole`/`getByText` with accessible names.
- The empty-state assertion ("No Records Found") is literal to the shared
  instance's state at the time of writing. If another user on the shared
  instance ever creates a performance review, this grid would show rows
  instead and the assertion would need updating — there's no API to reset
  this shared instance's data, and this module intentionally never creates
  the review itself (per `docs/ARCHITECTURE.md` §7) that would let it
  self-clean.
- Starting, saving, or submitting an employee performance review is
  intentionally not driven — doing so would create durable shared review
  data on the public demo with no delete/undo path.
