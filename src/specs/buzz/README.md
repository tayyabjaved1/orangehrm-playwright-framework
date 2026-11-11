# Buzz

## Scope
Covers viewing the Buzz newsfeed (`/web/index.php/buzz/viewBuzz`): the module
loads, the post composer is present, and existing feed content renders. This
module's coverage is **read-only** (see `docs/ARCHITECTURE.md` §7): Buzz posts
are durable, publicly visible to every user of this shared demo instance, and
there is no API or UI path to delete a post that this suite could use to clean
up after itself. Creating a post here would permanently pollute a shared
public instance with no safe undo, so this module never submits a post,
comment, reaction, photo/video share, or any other content-creating action.

## Navigation
- Entry route(s): `/web/index.php/buzz/viewBuzz`
- Preconditions: logged in as Admin via the shared `storageState` (no
  module-specific precondition)
- Required role/account: Admin (via shared session)

## Architecture
- Page Objects: `BuzzPage` (`pages/buzz.page.ts`) — extends `BasePage`,
  implements `waitForLoaded()` anchored on the `Buzz` breadcrumb
  (`this.breadcrumb('Buzz')`)
- Factories/generators: none — this module creates no data
- Types: none

## Test data
No generated data. The spec only reads whatever posts already exist in the
shared feed; it never asserts on specific post text since that content is
free-form and controlled by other users of the shared instance.

## Lifecycle and cleanup
Read-only: the spec opens the Buzz page, verifies the composer is present and
at least one existing post renders, and ends there. No record is created, so
there is no create → verify → delete → verify-gone sequence to run (see
`docs/ARCHITECTURE.md` §7).

## Automated coverage
See `docs/TEST_CATALOG.md`.
- Shows the newsfeed with the post composer and existing feed content —
  `@smoke @ui`

## Run
```bash
npx playwright test src/specs/buzz
```

## Known limitations
- Does not drive posting, commenting, reacting, sharing a photo/video, or any
  other mutating Buzz action — intentionally left undriven per the
  shared-instance data discipline in `docs/ARCHITECTURE.md` §7.
- `expectFeedContentVisible()` uses raw CSS class fallbacks
  (`.orangehrm-buzz`, `.orangehrm-buzz-post-body-text`) because individual
  feed posts expose no accessible role or distinguishing label/text (per
  `docs/ARCHITECTURE.md` §5).
- `expectFeedContentVisible()` accepts either outcome — at least one real post,
  or the newsfeed's own "No Posts Available" empty state — since the shared
  feed's content changes with other users' activity and an empty feed is a
  legitimate real state, not a failure to detect.
