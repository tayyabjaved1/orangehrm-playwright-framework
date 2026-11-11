import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';
import type { SystemUserData } from '../../data/types/admin.types';

/**
 * Admin > User Management > Add User form (`saveSystemUser`).
 *
 * Employee Name is a live autocomplete over real PIM employees on the shared demo
 * instance — there is no employee name a spec can safely invent, so this page always
 * types a common letter and accepts the dropdown's first real suggestion.
 */
export class AddUserPage extends BasePage {
  readonly path = '/web/index.php/admin/saveSystemUser';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    // This page's breadcrumb renders only the "Admin" module crumb (no second-level
    // crumb, unlike the System Users list) — anchor on the form's own heading instead,
    // per ARCHITECTURE.md §4's "or another stable heading" allowance.
    await expect(this.page.getByRole('heading', { name: 'Add User' })).toBeVisible();
  }

  /** Fills the Add User form from factory data and saves it. Status is fixed to Enabled
   * and the Employee Name is picked live (see class doc) — neither varies per spec. */
  async addUser(data: SystemUserData): Promise<void> {
    // The User Role / Status controls are OrangeHRM's custom oxd-select components: the
    // trigger itself exposes no role/label, but its opened options are real `option` roles
    // (ARCHITECTURE.md §5 point 4 — documented CSS fallback only for the trigger).
    await this.page.locator('.oxd-input-group', { hasText: 'User Role' }).locator('.oxd-select-text').click();
    await this.page.getByRole('option', { name: data.role }).click();

    const employeeInput = this.page
      .locator('.oxd-input-group', { hasText: 'Employee Name' })
      .getByPlaceholder('Type for hints...');
    await employeeInput.fill('a');
    // The dropdown briefly renders a "Searching...." placeholder option before real
    // suggestions arrive; its options carry no accessible role, so this polls the
    // documented CSS fallback directly (ARCHITECTURE.md §5 point 4).
    await this.page.waitForFunction(() => {
      const options = document.querySelectorAll('.oxd-autocomplete-option');
      return options.length > 0 && !options[0].textContent?.includes('Searching');
    });
    await this.page.locator('.oxd-autocomplete-option').first().click();

    await this.page.locator('.oxd-input-group', { hasText: 'Status' }).locator('.oxd-select-text').click();
    await this.page.getByRole('option', { name: 'Enabled' }).click();

    // Username/Password/Confirm Password render as plain inputs with no name, label or
    // placeholder association — scoped here by their field's own visible label text
    // within its `.oxd-input-group` (ARCHITECTURE.md §5 point 4).
    await this.page.locator('.oxd-input-group', { hasText: 'Username' }).locator('input').fill(data.username);
    await this.page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Password' })
      .filter({ hasNotText: 'Confirm' })
      .locator('input')
      .fill(data.password);
    await this.page.locator('.oxd-input-group', { hasText: 'Confirm Password' }).locator('input').fill(data.password);

    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async expectSuccessToast(): Promise<void> {
    await expect(this.page.locator('.oxd-toast')).toContainText('Successfully Saved');
  }
}
