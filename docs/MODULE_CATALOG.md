# Module Catalog

Only modules with code in the repository are marked `Implemented`. A module
intentionally left read-only (see `docs/ARCHITECTURE.md` §7) is still
`Implemented` — its README states the read-only scope explicitly.

| Module | Route | Coverage | Status | README |
|---|---|---|---|---|
| Auth | `/web/index.php/auth/login` | Valid login lands on dashboard; invalid password shows error | Implemented | [src/modules/auth/README.md](../src/modules/auth/README.md) |
| Dashboard | `/web/index.php/dashboard/index` | Key widgets visible after login | Implemented | [src/modules/dashboard/README.md](../src/modules/dashboard/README.md) |
| Admin | `/web/index.php/admin/viewAdminModule` | Add a system user, verify, delete | Implemented | [src/modules/admin/README.md](../src/modules/admin/README.md) |
| PIM | `/web/index.php/pim/viewPimModule` | Add an employee, verify, delete | Implemented | [src/modules/pim/README.md](../src/modules/pim/README.md) |
| Leave | `/web/index.php/leave/viewLeaveModule` | Apply for leave, verify, cancel | Implemented | [src/modules/leave/README.md](../src/modules/leave/README.md) |
| Time | `/web/index.php/time/viewTimeModule` | My Timesheet page loads with the current period (read-only) | Implemented | [src/modules/time/README.md](../src/modules/time/README.md) |
| Recruitment | `/web/index.php/recruitment/viewRecruitmentModule` | Add a candidate, verify, delete | Implemented | [src/modules/recruitment/README.md](../src/modules/recruitment/README.md) |
| My Info | `/web/index.php/pim/viewMyDetails` | Personal details load for the logged-in user (read-only) | Implemented | [src/modules/my-info/README.md](../src/modules/my-info/README.md) |
| Performance | `/web/index.php/performance/viewPerformanceModule` | Performance module landing loads (read-only) | Implemented | [src/modules/performance/README.md](../src/modules/performance/README.md) |
| Directory | `/web/index.php/directory/viewDirectory` | Search the employee directory, verify a result | Implemented | [src/modules/directory/README.md](../src/modules/directory/README.md) |
| Maintenance | `/web/index.php/maintenance/viewMaintenanceModule` | Password re-entry gate + Login Attempts view loads (read-only, no purge actions) | Implemented | [src/modules/maintenance/README.md](../src/modules/maintenance/README.md) |
| Claim | `/web/index.php/claim/viewClaimModule` | Submit Claim form loads with expense types populated (read-only) | Implemented | [src/modules/claim/README.md](../src/modules/claim/README.md) |
| Buzz | `/web/index.php/buzz/viewBuzz` | Buzz feed loads (read-only — no public post created) | Implemented | [src/modules/buzz/README.md](../src/modules/buzz/README.md) |

## Module conventions

Each module keeps its own Page Objects, factories/types (only when it creates
domain data), tests, and README under `src/modules/<module>/`. Add
`src/modules/<module>/README.md` from `docs/templates/MODULE_README.template.md`
when a module is introduced.
