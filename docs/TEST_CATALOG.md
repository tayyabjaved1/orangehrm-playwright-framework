# Test Catalog

Human-readable index of current automation. Keep synchronized with the actual
spec files — a test is not `Implemented` unless its spec exists and passes.

| Module | Spec | Scenario | Tags |
|---|---|---|---|
| Auth | `src/modules/auth/tests/login.spec.ts` | Valid login reaches the dashboard | `@smoke @ui` |
| Auth | `src/modules/auth/tests/login.spec.ts` | Invalid password shows an error, no navigation | `@smoke @ui` |
| Dashboard | `src/modules/dashboard/tests/dashboard.spec.ts` | Key widgets visible after login | `@smoke @ui` |
| Admin | `src/modules/admin/tests/system-users.spec.ts` | Add a system user, verify in grid, delete | `@smoke @ui` |
| PIM | `src/modules/pim/tests/add-employee.spec.ts` | Add an employee, verify in list, delete | `@regression @ui` |
| Leave | `src/modules/leave/tests/leave.spec.ts` | Grant entitlement, apply for leave, verify Pending Approval, cancel, verify Cancelled | `@smoke @ui` |
| Time | `src/modules/time/tests/employee-timesheets.spec.ts` | Timesheets landing page shows Select Employee + Pending Action grid (read-only) | `@smoke @ui` |
| Recruitment | `src/modules/recruitment/tests/candidate.spec.ts` | Add a candidate, find in list, delete | `@smoke @ui` |
| My Info | `src/modules/my-info/tests/my-info.spec.ts` | Logged-in user's own Personal Details load with a real Employee Id (read-only) | `@smoke @ui` |
| Performance | `src/modules/performance/tests/performance.spec.ts` | Reviews grid columns / empty state verified (read-only) | `@smoke @ui` |
| Directory | `src/modules/directory/tests/directory.spec.ts` | Search the employee directory, verify real results render | `@smoke @ui` |
| Maintenance | `src/modules/maintenance/tests/maintenance.spec.ts` | Administrator Access credential gate verified, never proceeds past it | `@regression @ui` |
| Claim | `src/modules/claim/tests/claim.spec.ts` | Employee Claims list/grid/Assign Claim button verified (read-only) | `@smoke @ui` |
| Buzz | `src/modules/buzz/tests/buzz.spec.ts` | Composer + feed (real post or empty state) verified (read-only) | `@smoke @ui` |

14 scenarios across 13 modules, all passing as of the last full-suite run
(2 consecutive clean runs, 15/15 including the `setup` auth run).

## Rules

- Add a row for every new spec or meaningful scenario in the same change.
- Remove rows when tests are deleted.
- State explicitly when a module's coverage is read-only by design (see
  `docs/ARCHITECTURE.md` §7) rather than omitting a row.
