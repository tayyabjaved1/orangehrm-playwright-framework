import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';

/** My Info's Personal Details tab — OrangeHRM redirects `/pim/viewMyDetails` here for the logged-in user's own employee record. Read-only module: see `docs/ARCHITECTURE.md` §7. */
export class PersonalDetailsPage extends BasePage {
  readonly path = '/web/index.php/pim/viewMyDetails';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    // OrangeHRM's own breadcrumb for this route reads "PIM" (not "My Info") — it reuses the
    // PIM employee-profile breadcrumb since viewMyDetails redirects into viewPersonalDetails.
    await expect(this.breadcrumb('PIM')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Personal Details', exact: true })).toBeVisible();
    // The "Personal Details" heading renders before the form section finishes its own
    // (separate) AJAX load — wait for the Employee Id input too, so the page is actually
    // ready to interact with, not just its heading shell.
    await expect(this.employeeIdInput).toBeVisible();
  }

  private get firstNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'First Name' });
  }

  private get lastNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Last Name' });
  }

  /** "Employee Id" input has no accessible label/role name in OrangeHRM's markup (the visible text
   * is a sibling node, not a <label>), so it's resolved via its `.oxd-input-group` wrapper's text,
   * per the selector policy fallback order (`docs/ARCHITECTURE.md` §5). */
  private get employeeIdInput(): Locator {
    return this.page.locator('.oxd-input-group', { hasText: 'Employee Id' }).locator('input');
  }

  /** Asserts the logged-in user's own employee identity renders with real, concrete content —
   * not just that the page loaded. The Employee Id is asserted to have an actual (non-empty)
   * value, since it is the one field observed to reliably carry real data for this account; the
   * Employee Full Name inputs are only asserted visible (not their value) because this is a
   * shared public instance where other concurrent users can clear the linked record's name at
   * any time — see `docs/ARCHITECTURE.md` §7 and §9. */
  async expectOwnEmployeeIdentityVisible(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.employeeIdInput).toBeVisible();
    await expect(this.employeeIdInput).toHaveValue(/\S+/);
  }
}
