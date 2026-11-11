import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';

/**
 * The Maintenance module's entry point. Unlike every other module, this route
 * never reaches the normal authenticated layout: OrangeHRM intercepts it with
 * a full-screen "Administrator Access" credential-confirmation gate (no
 * `.oxd-topbar-header-breadcrumb`, no sidebar), and confirming it lands
 * directly on the Purge Employee Records page — a destructive action with no
 * safe alternative sub-page. Per `docs/ARCHITECTURE.md` §7, this module's
 * safe, read-only scope stops at verifying the gate itself; see this
 * docs/MODULE_CATALOG.md's Maintenance section for why.
 */
export class MaintenancePage extends BasePage {
  readonly path = '/web/index.php/maintenance/viewMaintenanceModule';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    // No breadcrumb exists on this gate route, so anchor on its own heading instead.
    await expect(this.page.getByRole('heading', { name: 'Administrator Access' })).toBeVisible();
  }

  async expectAdministratorAccessGateVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Administrator Access' })).toBeVisible();
    await expect(
      this.page.getByText(
        'You have requested to access a critical Administrator function in OrangeHRM and are required to validate your credentials below',
      ),
    ).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Confirm' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  }

  /** @param username the expected pre-filled, disabled account identity shown on the gate */
  async expectUsernamePrefilled(username: string): Promise<void> {
    // Raw CSS fallback: this disabled input carries no accessible name/label/placeholder
    // (its sibling <label> isn't programmatically associated), and there are two
    // identical, nameless textboxes on this form, so a positional/role selector can't
    // distinguish them. The `name` attribute is real markup on the live page, not invented.
    await expect(this.page.locator('input[name="username"]')).toHaveValue(username);
  }

  /** Fills the password confirmation field. Never calls `.confirm()` — see class doc. */
  async enterPassword(password: string): Promise<void> {
    // Same raw CSS fallback rationale as `expectUsernamePrefilled`.
    await this.page.locator('input[name="password"]').fill(password);
  }

  async expectPasswordEntered(password: string): Promise<void> {
    await expect(this.page.locator('input[name="password"]')).toHaveValue(password);
  }
}
