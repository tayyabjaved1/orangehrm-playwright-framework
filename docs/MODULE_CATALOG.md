# Module Catalog

Only modules with code in the repository are marked `Implemented`. A module
intentionally left read-only (see `docs/ARCHITECTURE.md` §7) is still
`Implemented` — its README states the read-only scope explicitly.

| Module | Route (as entered) | Coverage | Status | README |
|---|---|---|---|---|
| Auth | `/web/index.php/auth/login` | Valid login lands on dashboard; invalid password shows error | Implemented | [src/specs/auth/README.md](../src/specs/auth/README.md) |
| Dashboard | `/web/index.php/dashboard/index` | Key widgets visible after login | Implemented | [src/specs/dashboard/README.md](../src/specs/dashboard/README.md) |
| Admin | `/web/index.php/admin/viewAdminModule` | Add a system user, verify in grid, delete | Implemented | [src/specs/admin/README.md](../src/specs/admin/README.md) |
| PIM | `/web/index.php/pim/viewPimModule` | Add an employee, verify, delete | Implemented | [src/specs/pim/README.md](../src/specs/pim/README.md) |
| Leave | `/web/index.php/leave/viewLeaveModule` | Grant entitlement, apply for leave, verify Pending Approval, cancel, verify Cancelled | Implemented | [src/specs/leave/README.md](../src/specs/leave/README.md) |
| Time | `/web/index.php/time/viewTimeModule` → redirects to `viewEmployeeTimesheet` | Timesheets landing page loads with Select Employee + Pending Action grid (read-only) | Implemented | [src/specs/time/README.md](../src/specs/time/README.md) |
| Recruitment | `/web/index.php/recruitment/viewRecruitmentModule` | Add a candidate, verify, delete | Implemented | [src/specs/recruitment/README.md](../src/specs/recruitment/README.md) |
| My Info | `/web/index.php/pim/viewMyDetails` | Logged-in user's own Personal Details load (Employee Id verified; read-only) | Implemented | [src/specs/my-info/README.md](../src/specs/my-info/README.md) |
| Performance | `/web/index.php/performance/viewPerformanceModule` → redirects to `searchEvaluatePerformanceReview` | Reviews grid columns / empty state verified (read-only) | Implemented | [src/specs/performance/README.md](../src/specs/performance/README.md) |
| Directory | `/web/index.php/directory/viewDirectory` | Search the employee directory, verify real results or empty state | Implemented | [src/specs/directory/README.md](../src/specs/directory/README.md) |
| Maintenance | `/web/index.php/maintenance/viewMaintenanceModule` → redirects straight to the Purge Employee credential gate | Administrator Access gate verified only — never proceeds past it (read-only, safety-critical) | Implemented | [src/specs/maintenance/README.md](../src/specs/maintenance/README.md) |
| Claim | `/web/index.php/claim/viewClaimModule` → redirects to `viewAssignClaim` | Employee Claims list/grid/Assign Claim button verified (read-only) | Implemented | [src/specs/claim/README.md](../src/specs/claim/README.md) |
| Buzz | `/web/index.php/buzz/viewBuzz` | Feed + composer verified; accepts either a real post or the empty state (read-only, no post created) | Implemented | [src/specs/buzz/README.md](../src/specs/buzz/README.md) |

## Module conventions

Each module keeps its own Page Objects under `src/pages/<module>/` and its
specs plus that module's README under `src/specs/<module>/` — layer-first,
matching core-pw-e2e-tests' convention. Factories/types (only when a module
creates domain data) live in the shared `src/data/`. Add
`src/specs/<module>/README.md` from `docs/templates/MODULE_README.template.md`
when a module is introduced.

## Notes from the first full build-out

- Several modules redirect from their nav-menu route to a more specific one
  (Time, Performance, Claim, Maintenance) — each module's README documents the
  real landing route it verified live, not the nav entry point alone.
- This is a single shared public instance: My Info's linked employee record and
  Directory's search results change between runs as other users interact with
  the same instance concurrently — both specs assert on stable, structural
  signals (e.g. Employee Id presence, "a result or an empty state") rather than
  specific values that could be true one run and false the next.
