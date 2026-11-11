import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';

export class DashboardPage extends BasePage {
  readonly path = '/web/index.php/dashboard/index';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.breadcrumb('Dashboard')).toBeVisible();
  }

  async expectKeyWidgetsVisible(): Promise<void> {
    await expect(this.page.getByText('Time at Work', { exact: true })).toBeVisible();
    await expect(this.page.getByText('My Actions', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Quick Launch', { exact: true })).toBeVisible();
  }

  /** @param name the sidebar module's visible label, e.g. 'PIM', 'Leave' */
  async openModule(name: string): Promise<void> {
    await this.page.locator('.oxd-main-menu').getByRole('link', { name, exact: true }).click();
  }
}
