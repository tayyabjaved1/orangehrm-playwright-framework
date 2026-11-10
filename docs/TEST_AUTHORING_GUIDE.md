# Test Authoring Guide

## 1. Imports

```ts
import { test } from '@playwright/test';
```

No custom test fixture exists yet — page objects are constructed directly in
each spec's "Data preparation and initialisation" step (see `docs/ARCHITECTURE.md` §8).

## 2. Example

```ts
import { test } from '@playwright/test';
import { EmployeeFactory } from '../../../data/factories/employee.factory';
import { EmployeeListPage } from '../pages/employee-list.page';
import { AddEmployeePage } from '../pages/add-employee.page';

test.describe('PIM - Add Employee', { tag: ['@regression', '@ui'] }, () => {
  test('adds an employee and removes it again', async ({ page }) => {
    let employee: ReturnType<typeof EmployeeFactory.create>;
    let employeeList: EmployeeListPage;
    let addEmployee: AddEmployeePage;

    await test.step('Data preparation and initialisation', async () => {
      employee = EmployeeFactory.create();
      employeeList = new EmployeeListPage(page);
      addEmployee = new AddEmployeePage(page);
    });

    await test.step('Add the employee', async () => {
      await addEmployee.open();
      await addEmployee.submit(employee);
    });

    await test.step('Verify the employee appears in the employee list', async () => {
      await employeeList.open();
      await employeeList.expectEmployeeListed(employee);
    });

    await test.step('Delete the employee', async () => {
      await employeeList.deleteEmployee(employee);
    });

    await test.step('Verify the employee no longer appears in the list', async () => {
      await employeeList.expectEmployeeNotListed(employee);
    });
  });
});
```

## 3. Rules

- **Tags** on `test.describe` via Playwright's native `{ tag: [...] }` — `@smoke`
  for the one or two most important journeys per module, `@regression` for the
  rest, `@ui` always. No tag embedded in the title string.
- **Declare everything at the top as `let`**, assign inside steps — a step never
  returns a value another step depends on implicitly.
- **First step is always "Data preparation and initialisation."**
- **Action/verification split**: a step either performs an action or verifies an
  outcome — never both. Verification step labels start with **`Verify...`**.
- **No raw selectors, no raw `expect(locator)` in a spec.** Every interaction and
  assertion goes through a page object method. See `docs/ARCHITECTURE.md` §5.
- **A spec that creates a record deletes it before the test ends** (see
  `docs/ARCHITECTURE.md` §7) — the delete and its own verification are their own
  named steps, not folded into cleanup.
- **Don't hardcode content a factory generated.** Reference the factory's
  returned fields, never copy a literal string the factory could change.
- **One journey per `test()`.** A module with more than one journey (e.g. PIM's
  Add Employee vs. Search Employee) gets separate `test()`s, and a separate spec
  file once the module grows past one journey.

## 4. Page object conventions

- One page object per unique OrangeHRM route — a list page and an add/edit
  page for the same entity are two page objects (`EmployeeListPage`,
  `AddEmployeePage`), not one.
- Every page object extends `BasePage`: set `readonly path`, implement
  `waitForLoaded()` anchored on the page's own breadcrumb/heading, and let
  specs call `open()` — never `goto()` directly.
- Assertion methods are named `expect*` and contain the `expect(...)` call.
- Follow the selector policy in `docs/ARCHITECTURE.md` §5; document any raw
  CSS-class fallback inline with the reason.

## 5. Before committing

```bash
npm run typecheck
npx playwright test src/modules/<module>/tests
```

Then the full suite once your module is in:

```bash
npx playwright test
```
