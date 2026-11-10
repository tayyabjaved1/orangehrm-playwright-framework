import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../../core/base-page';
import type { EmployeeData } from '../../../data/types/pim.types';

export class EmployeeListPage extends BasePage {
  readonly path = '/web/index.php/pim/viewEmployeeList';

  constructor(page: Page) { super(page); }

  // See AddEmployeePage: the PIM breadcrumb doesn't distinguish routes, so this anchors on the
  // list page's own "Employee Information" heading instead.
  async waitForLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Employee Information', level: 5 })).toBeVisible();
  }

  private fullName(employee: EmployeeData): string {
    return `${employee.firstName} ${employee.lastName}`;
  }

  // The "Employee Name" and "Supervisor Name" filters share the same placeholder
  // ("Type for hints...") and OrangeHRM's <label> isn't wired to its input via `for`/`id`, so
  // getByLabel/getByPlaceholder can't resolve one uniquely — scope by the label text's own
  // input-group container instead.
  private nameFilter(): Locator {
    return this.page
      .locator('.oxd-input-group', { has: this.page.getByText('Employee Name', { exact: true }) })
      .getByRole('textbox');
  }

  /** The grid row matching this employee, identified by its accessible row name (id + first +
   * last name, as OrangeHRM renders it). */
  private row(employee: EmployeeData): Locator {
    return this.page.getByRole('row', { name: new RegExp(`${employee.firstName}.*${employee.lastName}`) });
  }

  /** Types the employee's full name and commits the live-search suggestion into the filter,
   * then runs the search. Required because the name field is bound to the selected suggestion,
   * not the raw typed text — searching without selecting a suggestion ignores the name filter
   * entirely. */
  async searchByName(employee: EmployeeData): Promise<void> {
    await this.nameFilter().fill(this.fullName(employee));
    await this.page.getByRole('option', { name: this.fullName(employee) }).click();
    await this.page.getByRole('button', { name: 'Search' }).click();
  }

  async expectEmployeeListed(employee: EmployeeData): Promise<void> {
    await this.searchByName(employee);
    await expect(this.row(employee)).toBeVisible();
    await expect(this.row(employee)).toHaveCount(1);
  }

  async deleteEmployee(employee: EmployeeData): Promise<void> {
    await this.searchByName(employee);
    const row = this.row(employee);
    // OrangeHRM renders a real checkbox <input> but overlays a custom check icon on top of it;
    // clicking the input directly is intercepted by that icon, so click the icon instead.
    await row.locator('.oxd-checkbox-input-icon').click();
    await this.page.getByRole('button', { name: 'Delete Selected' }).click();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Yes, Delete' }).click();
  }

  async expectEmployeeNotListed(employee: EmployeeData): Promise<void> {
    await this.nameFilter().fill(this.fullName(employee));
    // Once the employee is gone, the live-search suggestion list itself reports
    // "No Records Found" for the typed name — the same real-time signal a user relies on, and
    // the only one available here: with no matching suggestion to select, there is no way to
    // commit this name into the main grid's filter at all.
    await expect(
      this.page.locator('.oxd-autocomplete-dropdown').getByText('No Records Found', { exact: true }),
    ).toBeVisible();
  }
}
