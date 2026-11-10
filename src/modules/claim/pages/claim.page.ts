import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../../core/base-page';

export class ClaimPage extends BasePage {
  readonly path = '/web/index.php/claim/viewClaimModule';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.breadcrumb('Claim')).toBeVisible();
  }

  async expectEmployeeClaimsListVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Employee Claims', level: 5 })).toBeVisible();
  }

  async expectAssignClaimButtonVisible(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Assign Claim' })).toBeVisible();
  }

  async expectClaimsGridColumnsVisible(): Promise<void> {
    for (const name of [
      'Reference Id',
      'Employee Name',
      'Event Name',
      'Description',
      'Currency',
      'Submitted Date',
      'Status',
      'Amount',
      'Actions',
    ]) {
      await expect(this.page.getByRole('columnheader', { name })).toBeVisible();
    }
  }

  async expectRecordsFoundVisible(): Promise<void> {
    await expect(this.page.getByText('Records Found', { exact: false })).toBeVisible();
  }
}
