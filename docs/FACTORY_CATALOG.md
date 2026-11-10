# Factory Catalog

| Factory | File | Produces | Uniqueness guarantee |
|---|---|---|---|
| `UserFactory` | `src/data/factories/user.factory.ts` | A system-user account (username/password/role) for Admin > User Management | `username()` includes 10 random alphanumeric chars |
| `EmployeeFactory` | `src/data/factories/employee.factory.ts` | A PIM employee (first/last name) | Fresh Faker name per call; disambiguated further by the generated username when one is attached |
| `CandidateFactory` | `src/data/factories/candidate.factory.ts` | A Recruitment candidate (name, email) | Fresh Faker name + unique email per call |
| `LeaveFactory` | `src/data/factories/leave.factory.ts` | A leave application (type, date range, comment) | Comment includes a unique token so the created request is identifiable in the list |

Add a row here in the same change that adds or removes a factory (see
`docs/DOCUMENTATION_POLICY.md`).
