# orangehrm-playwright-framework

Playwright + TypeScript E2E framework for the public [OrangeHRM demo](https://opensource-demo.orangehrmlive.com).

## Documentation

- [Architecture and conventions](docs/ARCHITECTURE.md)
- [Test authoring guide](docs/TEST_AUTHORING_GUIDE.md)
- [Data factory guide](docs/DATA_FACTORY_GUIDE.md) / [Factory catalog](docs/FACTORY_CATALOG.md)
- [Module catalog](docs/MODULE_CATALOG.md) / [Test catalog](docs/TEST_CATALOG.md) / [Traceability](docs/TRACEABILITY.md)
- [Configuration guide](docs/CONFIGURATION.md)
- [Documentation as Code policy](docs/DOCUMENTATION_POLICY.md) / [Change impact matrix](docs/CHANGE_IMPACT_MATRIX.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](docs/CHANGELOG.md)

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

## Run

```bash
npm test                 # full suite
npm run test:smoke        # @smoke-tagged tests
npm run test:regression   # @regression-tagged tests
npm run typecheck         # TypeScript validation
npm run docs:check        # enforce documentation updates for changed code
npm run report            # open HTML report
npm run report:allure     # render + open the Allure report (needs Java; see docs/CONFIGURATION.md)
```

## Architecture

- `src/core`: env reader, `BasePage` readiness contract.
- `src/setup/auth.setup.ts`: logs in once via the real UI, saves `storageState` —
  every module except Auth starts already authenticated.
- `src/data/generators` + `src/data/factories` + `src/data/types`: fresh,
  collision-resistant runtime data for anything a spec creates.
- `src/pages/<module>/` + `src/specs/<module>/{*.spec.ts,README.md}`: layer-first, one subfolder per OrangeHRM module in each layer.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full picture.

## Shared public instance — read this before adding a spec

`opensource-demo.orangehrmlive.com` is a single shared instance with no
per-run tenant and no API to reset state. Every spec that creates data
(Admin, PIM, Leave, Recruitment) deletes it again before the test ends. Modules
where the only meaningful action has no safe undo (Buzz, Claim, Maintenance,
Time, My Info, Performance) are intentionally **read-only**: each verifies its
own page loads with real content, documented in that module's README. See
[docs/ARCHITECTURE.md §7](docs/ARCHITECTURE.md#7-shared-instance-data-discipline--this-is-not-a-sandbox).

## License

[MIT](LICENSE)
