# Data Factory Guide

## Why

Every record a spec creates on the shared OrangeHRM demo must be unique (no
collisions with another concurrent user) and self-identifying (a spec can find
and delete exactly what it created). Factories exist to guarantee both without
every spec re-deriving them.

## Generators (`src/data/generators/common.generator.ts`)

`CommonGenerator` wraps Faker for the primitives every factory needs: names,
a collision-resistant `username()`, `email()`, `password()`, `phone()`, and
date helpers (`dateFromToday(offset)`, `isoDate(date)`). Generators are
domain-agnostic — they know nothing about OrangeHRM entities.

## Factories (`src/data/factories/`)

One factory per entity, parameter-free with override support:

```ts
static create(overrides: Partial<EntityData> = {}): EntityData {
  return { ...generatedDefaults, ...overrides };
}
```

- A factory never makes network/API calls — OrangeHRM's demo exposes no usable
  public data API, so every entity is created through the real UI by the page
  object, using data the factory generated.
- A factory's returned type carries every field a spec might need to assert on
  or to find/delete the record later (e.g. the generated username/employee
  name) — specs reference these fields, never hardcode a copy.

See `docs/FACTORY_CATALOG.md` for the current list.

## Types (`src/data/types/`)

One `<module>.types.ts` per module that needs its own data shape — keeps
ownership obvious and avoids two modules' factories editing the same file.
