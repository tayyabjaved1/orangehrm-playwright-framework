# Architecture

How the suite is layered, how authentication works, and the conventions every
module follows.

## 1. Goals

This is an E2E framework for the public [OrangeHRM demo](https://opensource-demo.orangehrmlive.com),
built by combining the documentation-as-code discipline of a reference
framework (catalogs, templates, enforced doc updates) with the spec-authoring
rigor of a production suite (named `test.step`s, no raw selectors in specs,
assert-real-behaviour, self-cleaning data). It is a single shared public
instance, not a sandboxed tenant — see §7 for what that means for every module.

## 2. Layers

```
specs/        the tests — one journey per test, composed of named test.step()s
  │  use
  ▼
pages/        page objects — locators, actions, assertions (no API calls)
data/         factories/generators — fresh runtime data for anything a spec creates
  │  use
  ▼
core/         primitives — env reader, BasePage contract
```

- **`core/`** — `env.ts` (`requireEnv`) and `base-page.ts` (`BasePage`).
- **`data/generators/`** — `CommonGenerator`: shared Faker-based primitives (name,
  username, email, password, phone, dates). Every call returns a fresh value.
- **`data/factories/`** — one factory per entity a module creates (`UserFactory`,
  `EmployeeFactory`, `CandidateFactory`, ...). Parameter-free, override-friendly:
  `Factory.create(overrides?)`.
- **`data/types/`** — one `<module>.types.ts` per module that needs its own data
  shape. Don't add to another module's type file — avoids file conflicts and
  keeps ownership obvious.
- **`pages/<module>/`** — page objects extending `BasePage`.
- **`specs/<module>/`** — specs. Module-level documentation (scope,
  architecture, known limitations) lives centrally in `docs/MODULE_CATALOG.md`
  (see `docs/templates/MODULE_SECTION.template.md`) — matching core-pw-e2e-tests'
  approach, not a README per module.

## 3. Authentication: one real login, reused everywhere

`src/setup/auth.setup.ts` logs in once through the real UI (`LoginPage`) and
saves the session via Playwright's `storageState`. `playwright.config.ts`'s
`chromium` project depends on that `setup` project and injects the saved
state — every module's specs start **already authenticated**, landing directly
on their module's route with no per-test login.

**The only exception is the Auth module itself** (`chromium-auth` project, no
`storageState`) — it drives the real `LoginPage` because the login form is what
it tests. No other module should import or drive `LoginPage`.

## 4. Page readiness

Every page object extends `BasePage` (`src/core/base-page.ts`), which provides:

- `path` — the page's URL, relative to `baseURL`.
- `goto()` — raw navigation to `path`.
- `waitForLoaded()` — **abstract**; each page implements its own, anchored on
  that page's own elements. Most OrangeHRM module pages: assert the module
  breadcrumb heading is visible via `this.breadcrumb('<Module Name>')`
  (the shared helper on `BasePage`, which resolves
  `.oxd-topbar-header-breadcrumb`'s `<h6>` text).
- `open()` — `goto()` + `waitForLoaded()`. Specs call `open()`, not `goto()`.

## 5. Selector policy

Prefer, in order:

1. **Role / accessible name** (`getByRole`) — OrangeHRM's `oxd-*` component
   library renders real buttons/links/headings with accessible names; this
   covers most interactions.
2. **Label / placeholder** (`getByLabel`, `getByPlaceholder`) — form inputs.
3. **Breadcrumb / text content** (`getByText`) for page/section identification.
4. **A documented CSS class fallback** only when OrangeHRM's Vue component
   exposes no role/label/text — e.g. a specific `.oxd-table-cell` column, a
   toast/alert container. Document *why* inline, same as `TextBoxPage` in the
   DemoQA framework does for its own fallbacks.

Never use positional/nth-based selectors or raw XPath. This is a third-party
open-source app — don't invent attributes it doesn't have.

## 6. Test integrity — assert real behaviour, never just green

A passing test must fail when the feature breaks.

- Assert the user-facing outcome a test claims (the new user appears in the
  grid with its exact username, the error toast names the real problem) —
  never a proxy ("URL didn't change" without checking what *is* shown).
- A negative assertion needs a positive partner: "still on the same page" pairs
  with "the validation error is visible," not alone.
- Prefer Playwright's auto-waiting web-first assertions
  (`expect(locator).toBeVisible()`, `toContainText(...)`) over manual waits.

## 7. Shared-instance data discipline — this is not a sandbox

`opensource-demo.orangehrmlive.com` is a single public instance anyone can use
concurrently — there is no per-run tenant, no API to provision/reset state.
Two rules follow directly from that:

- **Every record a spec creates must be uniquely named** (via `CommonGenerator`)
  so it can never collide with another concurrent user's data, and **must be
  deleted by the same spec before it ends** — create → verify → delete → verify
  gone, all in one test. There is no separate teardown hook; do it in the
  test's own steps.
- **A module whose only meaningful actions mutate durable shared data with no
  safe undo** (e.g. Buzz posts, submitted Claims, Maintenance's purge actions)
  stays **read-only** in this suite: verify the module's own page loads and its
  real content renders, and do not perform the mutating action. Document this
  explicitly in that module's section of `docs/MODULE_CATALOG.md` under "Known
  limitations" — see `docs/templates/MODULE_SECTION.template.md`.

## 8. Tags and spec structure

- `test.describe('<Module> - <Journey>', { tag: [...] }, () => { ... })` —
  native Playwright tags, never embedded in the title string.
- Every `test()` is split into named `test.step()`s: a first **"Data
  preparation and initialisation"** step constructing page objects/factory
  data, then named action steps, then named **`Verify...`** steps. Keep action
  and verification separate — a step never does both.
- No raw selectors or raw `expect(locator)` calls in a spec — everything goes
  through a page object action or `expect*` method.

## 9. Known boundaries

- The public OrangeHRM demo can be slow, rate-limited, or have its data reset
  by its maintainers at any time — these aren't this repo's failures, but spec
  assertions should still be literal and falsifiable so a real regression is
  distinguishable from instance flakiness.
- Not every OrangeHRM module/sub-feature is covered — see `docs/MODULE_CATALOG.md`
  for current scope vs. planned.
