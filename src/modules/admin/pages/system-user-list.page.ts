import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../../core/base-page';

/** Admin > User Management > System Users grid — search, select, and delete user accounts. */
export class SystemUserListPage extends BasePage {
  readonly path = '/web/index.php/admin/viewSystemUsers';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.breadcrumb('User Management')).toBeVisible();
  }

  private usernameSearchInput(): Locator {
    return this.page.locator('.oxd-input-group', { hasText: 'Username' }).locator('input');
  }

  // Grid rows render as plain divs with no accessible role/label — scoping a row by its
  // own visible username text is the only stable hook OrangeHRM gives here
  // (ARCHITECTURE.md §5 point 4).
  private userRow(username: string): Locator {
    return this.page.locator('.oxd-table-body .oxd-table-card', { hasText: username });
  }

  async searchByUsername(username: string): Promise<void> {
    await this.usernameSearchInput().fill(username);
    await this.page.getByRole('button', { name: 'Search' }).click();
  }

  /** Selects the row's checkbox, clicks Delete, and confirms the dialog. */
  async deleteUser(username: string): Promise<void> {
    // The row checkbox's check-icon visually overlays its own input, so a forced click is
    // required (documented CSS fallback — ARCHITECTURE.md §5 point 4).
    await this.userRow(username).locator('.oxd-table-cell .oxd-checkbox-input').first().click({ force: true });
    await this.page.getByRole('button', { name: 'Delete Selected' }).click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
  }

  async expectUserListed(username: string): Promise<void> {
    await expect(this.userRow(username)).toHaveCount(1);
  }

  async expectUserNotListed(username: string): Promise<void> {
    await expect(this.userRow(username)).toHaveCount(0);
  }
}
