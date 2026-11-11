# Change Impact Matrix

Use this checklist before opening a pull request.

| I changed... | Check these areas | Expected evidence |
|---|---|---|
| Factory/generator/type | Factory guide, factory catalog | New fields, constraints, uniqueness documented |
| Spec file | Test catalog, traceability, docs/MODULE_CATALOG.md section | Scenario, tags, preconditions and assertions accurately listed |
| Page object | docs/MODULE_CATALOG.md section, test authoring guide if convention changed | Public methods and selector strategy documented |
| Config/CI/dependencies | README and configuration guide | New env vars, commands, pipeline behavior documented |
| Removal/deprecation | All references, catalogs, changelog | No stale links or claims |

## Removal-specific checks

- [ ] Remove deleted scenarios from `TEST_CATALOG.md` and `TRACEABILITY.md`.
- [ ] Remove or mark removed factories/modules in their catalogs.
- [ ] Record breaking changes in `CHANGELOG.md`.
