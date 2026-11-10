# Requirement-to-Test Traceability

| Requirement ID | Requirement / behavior | Automated test | Status |
|---|---|---|---|
| AUTH-001 | A valid user can log in and reach the dashboard | `src/modules/auth/tests/login.spec.ts` | Implemented |
| AUTH-002 | An invalid password is rejected with a visible error | `src/modules/auth/tests/login.spec.ts` | Implemented |
| DASH-001 | The dashboard shows its key widgets after login | `src/modules/dashboard/tests/dashboard.spec.ts` | Implemented |

## Rules

- Give each meaningful scenario a stable requirement ID (`<MODULE>-<NNN>`).
- Keep the mapping current when specs are renamed, split, merged, or removed.
- A requirement covered only read-only (per `docs/ARCHITECTURE.md` §7) is still
  `Implemented` if its spec verifies real page content — mark `Not automated`
  only if nothing verifies it yet.
