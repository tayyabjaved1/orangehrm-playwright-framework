## <Module Name>

**Scope.** What user-visible capability does this module cover? State plainly
whether this module's coverage is **mutating-and-self-cleaning** or
**read-only** (see `docs/ARCHITECTURE.md` §7) and why.

**Navigation.** Entry route(s). Preconditions (logged in via the shared
`storageState` is true for every module except Auth — note any
module-specific precondition). Required role/account.

**Architecture.** Page Objects (name each; confirm it extends `BasePage` and
implements `waitForLoaded()` anchored on its own elements — see
`docs/ARCHITECTURE.md` §4). Factories/generators. Types.

**Test data.** Generated fields, uniqueness guarantees, and any static/reference
data (dropdown values, fixed IDs) the module depends on.

**Lifecycle.** If this module creates data: the create → verify → delete →
verify-gone sequence, all inside the test. If read-only: state that explicitly
and why (§7).

**Coverage** (`src/specs/<module>/<file>.spec.ts`): scenario description —
tag(s), e.g. `@smoke @ui` (set via Playwright's native `{ tag: [...] }`
option, not embedded in the title string).

**Known limitations.** Unimplemented sub-features; any raw-selector fallback
used because an element has no accessible role/label/text (per
`docs/ARCHITECTURE.md` §5) and why; any shared-instance risk specific to this
module (§7) — e.g. a mutating action intentionally left undriven.

---

Add this section to `docs/MODULE_CATALOG.md` (and a row to its summary table)
in the same change that introduces the module — see an existing module's
section there for a filled-in example.
