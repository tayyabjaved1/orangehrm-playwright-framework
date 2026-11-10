# Test Catalog

Human-readable index of current automation. Keep synchronized with the actual
spec files — a test is not `Implemented` unless its spec exists and passes.

| Module | Spec | Scenario | Tags |
|---|---|---|---|
| Auth | `src/modules/auth/tests/login.spec.ts` | Valid login reaches the dashboard | `@smoke @ui` |
| Auth | `src/modules/auth/tests/login.spec.ts` | Invalid password shows an error, no navigation | `@smoke @ui` |
| Dashboard | `src/modules/dashboard/tests/dashboard.spec.ts` | Key widgets visible after login | `@smoke @ui` |

## Rules

- Add a row for every new spec or meaningful scenario in the same change.
- Remove rows when tests are deleted.
- State explicitly when a module's coverage is read-only by design (see
  `docs/ARCHITECTURE.md` §7) rather than omitting a row.
