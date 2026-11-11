import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';

/**
 * `/leave/addLeaveEntitlement` — grants an employee leave balance for a leave type.
 *
 * The live demo's Admin/`John Mike Doe` account carries **zero leave balance for every
 * leave type** (verified live), so the self-service Apply Leave form renders no form at
 * all ("No Leave Types with Leave Balance") until a balance exists. This page is the
 * necessary precondition the Leave journey spec grants for its own employee before
 * applying — see the module README's "Known limitations" for detail.
 */
export class AddLeaveEntitlementPage extends BasePage {
  readonly path = '/web/index.php/leave/addLeaveEntitlement';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.breadcrumb('Leave')).toBeVisible();
    // This view has no heading role — OrangeHRM renders its title as a plain <p>.
    await expect(this.page.getByText('Add Leave Entitlement', { exact: true })).toBeVisible();
  }

  /** The field groups here have a visible `<label>` that isn't programmatically
   * associated with its input (no `for`/`id`, no wrapping) — `getByLabel` can't resolve
   * it (verified live), so every field is looked up via its label's text container. */
  private fieldGroup(label: string): Locator {
    return this.page.locator('.oxd-input-group', { hasText: label });
  }

  private leaveTypeSelect(): Locator { return this.page.locator('.oxd-select-text').first(); }

  /**
   * Grants `days` of entitlement to `employeeName` for whichever leave type is first in
   * the dropdown — never hardcoded, since available leave types vary per instance.
   * @returns the leave type's exact label, so the caller can apply against the same type.
   */
  async grantEntitlementForFirstAvailableLeaveType(employeeName: string, days: number): Promise<string> {
    await this.fieldGroup('Employee Name').getByRole('textbox', { name: 'Type for hints...' }).fill(employeeName);
    await this.page.getByRole('option', { name: employeeName, exact: true }).click();

    await this.leaveTypeSelect().click();
    const firstOption = this.page.locator('.oxd-select-dropdown .oxd-select-option').nth(1);
    const leaveType = (await firstOption.textContent())?.trim() ?? '';
    await firstOption.click();

    await this.fieldGroup('Entitlement').locator('input').fill(String(days));
    await this.page.getByRole('button', { name: 'Save' }).click();

    // OrangeHRM shows an "Updating Entitlement" confirmation dialog when this
    // employee/leave-type/period combination already carries an entitlement record
    // (even a zero one) — confirm it so the grant actually goes through.
    const confirm = this.page.getByRole('button', { name: 'Confirm' });
    await confirm.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => undefined);
    if (await confirm.isVisible().catch(() => false)) await confirm.click();

    return leaveType;
  }

  async expectEntitlementGranted(): Promise<void> {
    await expect(this.page.getByText('Successfully Saved', { exact: true })).toBeVisible();
  }
}
