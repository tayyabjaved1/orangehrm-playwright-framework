import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../../core/base-page';
import type { EmployeeData } from '../../../data/types/pim.types';

export class AddEmployeePage extends BasePage {
  readonly path = '/web/index.php/pim/addEmployee';

  constructor(page: Page) { super(page); }

  // The PIM breadcrumb reads just "PIM" for every PIM route (list, add, details alike), so it
  // can't distinguish this page from the others — anchor on this page's own "Add Employee"
  // heading instead, per ARCHITECTURE.md §4's documented alternative.
  async waitForLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Add Employee', level: 6 })).toBeVisible();
  }

  /** Fills the required name fields and saves. The Employee Id field is auto-filled by
   * OrangeHRM and is left as-is. */
  async submit(employee: EmployeeData): Promise<void> {
    await this.page.getByRole('textbox', { name: 'First Name' }).fill(employee.firstName);
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(employee.lastName);
    await this.page.getByRole('button', { name: 'Save' }).click();
  }
}
