import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import type { EmployeeData } from '../../data/types/pim.types';

/**
 * The Personal Details page OrangeHRM redirects to after `AddEmployeePage.submit()`. Its URL
 * carries a server-assigned employee number that doesn't exist until the save succeeds, so this
 * page is only ever reached via that workflow — specs call `waitForLoaded()` directly on it,
 * never `open()`/`goto()`.
 */
export class EmployeeDetailsPage extends BasePage {
  readonly path = '/web/index.php/pim/viewPersonalDetails';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
    await expect(this.page.getByRole('heading', { name: 'Personal Details', level: 6 })).toBeVisible();
  }

  async expectDisplaysEmployee(employee: EmployeeData): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: `${employee.firstName} ${employee.lastName}`, level: 6 }),
    ).toBeVisible();
  }
}
