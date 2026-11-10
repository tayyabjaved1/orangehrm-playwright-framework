import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../../core/base-page';

/**
 * The Time module's landing page: OrangeHRM redirects `viewTimeModule` here.
 * Shows a "Select Employee" lookup and a "Timesheets Pending Action" grid of
 * other employees' submitted timesheets awaiting the logged-in user's action.
 */
export class EmployeeTimesheetsPage extends BasePage {
  readonly path = '/web/index.php/time/viewEmployeeTimesheet';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.breadcrumb('Timesheets')).toBeVisible();
  }

  async expectSelectEmployeeSectionVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Select Employee', level: 6 })).toBeVisible();
    // No <label for>/aria-labelledby association on this OrangeHRM Vue input —
    // the visible "Employee Name*" text is a sibling, not a label; placeholder resolves.
    await expect(this.page.getByPlaceholder('Type for hints...')).toBeVisible();
  }

  async expectPendingActionGridVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Timesheets Pending Action', level: 6 })).toBeVisible();
    // Dynamic shared-instance count — assert the pattern, not a literal number.
    await expect(this.page.getByText(/\(\d+\) Records? Found/)).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Employee Name' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Timesheet Period' })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  }
}
