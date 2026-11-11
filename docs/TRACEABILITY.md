# Requirement-to-Test Traceability

| Requirement ID | Requirement / behavior | Automated test | Status |
|---|---|---|---|
| AUTH-001 | A valid user can log in and reach the dashboard | `src/specs/auth/login.spec.ts` | Implemented |
| AUTH-002 | An invalid password is rejected with a visible error | `src/specs/auth/login.spec.ts` | Implemented |
| DASH-001 | The dashboard shows its key widgets after login | `src/specs/dashboard/dashboard.spec.ts` | Implemented |
| ADM-001 | An Admin can add a system user and delete it again | `src/specs/admin/system-users.spec.ts` | Implemented |
| PIM-001 | An Admin can add an employee and delete it again | `src/specs/pim/add-employee.spec.ts` | Implemented |
| LEAVE-001 | An employee can apply for leave and see it Pending Approval, then cancel it | `src/specs/leave/leave.spec.ts` | Implemented |
| TIME-001 | The Timesheets landing page loads with real content | `src/specs/time/employee-timesheets.spec.ts` | Implemented (read-only) |
| RECR-001 | An Admin can add a recruitment candidate and delete it again | `src/specs/recruitment/candidate.spec.ts` | Implemented |
| MYINFO-001 | The logged-in user's own Personal Details load | `src/specs/my-info/my-info.spec.ts` | Implemented (read-only) |
| PERF-001 | The Performance reviews grid loads with real content | `src/specs/performance/performance.spec.ts` | Implemented (read-only) |
| DIR-001 | An employee can be found via the Directory search | `src/specs/directory/directory.spec.ts` | Implemented |
| MAINT-001 | The Maintenance module gates access behind a password re-entry, with no destructive action driven | `src/specs/maintenance/maintenance.spec.ts` | Implemented (read-only, safety-critical) |
| CLAIM-001 | The Employee Claims list loads with real content | `src/specs/claim/claim.spec.ts` | Implemented (read-only) |
| BUZZ-001 | The Buzz newsfeed and composer load with real content | `src/specs/buzz/buzz.spec.ts` | Implemented (read-only) |

## Rules

- Give each meaningful scenario a stable requirement ID (`<MODULE>-<NNN>`).
- Keep the mapping current when specs are renamed, split, merged, or removed.
- A requirement covered only read-only (per `docs/ARCHITECTURE.md` §7) is still
  `Implemented` if its spec verifies real page content — mark `Not automated`
  only if nothing verifies it yet.
