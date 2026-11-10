# Factory Catalog

| Factory | File | Produces | Uniqueness guarantee |
|---|---|---|---|
| `UserFactory` | `src/data/factories/user.factory.ts` | A system-user account (username/password/role: ESS) for Admin > User Management | `CommonGenerator.username()`/`password()` |
| `EmployeeFactory` | `src/data/factories/employee.factory.ts` | A PIM employee (first/last name) | Fresh Faker name per call |
| `CandidateFactory` | `src/data/factories/candidate.factory.ts` | A Recruitment candidate (first/last name, email) | First name built from `CommonGenerator.username('candidate')` — not a plain Faker name — so the live Candidates search (first-name prefix match) always resolves to exactly one row, even with many duplicate Faker names already on the shared instance |
| `LeaveFactory` | `src/data/factories/leave.factory.ts` | A leave application (from/to date, comment) | Comment includes a unique token so the created request is identifiable in "My Leave" |

Add a row here in the same change that adds or removes a factory (see
`docs/DOCUMENTATION_POLICY.md`).
