import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../../core/base-page';
import type { LeaveApplicationData } from '../../../data/types/leave.types';

/** `/leave/applyLeave` — the employee self-service leave application form. */
export class ApplyLeavePage extends BasePage {
  readonly path = '/web/index.php/leave/applyLeave';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Apply Leave' })).toBeVisible();
  }

  /** Field labels here aren't programmatically associated with their inputs (verified
   * live, no `for`/`id`), so fields are looked up via their label's text container. */
  private fieldGroup(label: string): Locator {
    return this.page.locator('.oxd-input-group', { hasText: label });
  }

  private leaveTypeSelect(): Locator { return this.page.locator('.oxd-select-text').first(); }

  /** True once the form's leave type dropdown is actually rendered — it does not
   * appear at all when the employee has no leave type with a balance to apply against. */
  async hasApplicableLeaveTypes(): Promise<boolean> {
    return (await this.leaveTypeSelect().count()) > 0;
  }

  /** Typing into this masked date input is unreliable — verified live, both `fill()` and
   * typing at speed intermittently garble or duplicate the value (e.g. produce
   * `2026-12-102026-12-10` or reorder digits into `2026-22-11`). The date picker UI is
   * driven instead: open it via the field's calendar icon, pick the target month from its
   * dropdown, then click the exact day cell. */
  private async setDate(label: string, isoDate: string): Promise<void> {
    const [year, month, day] = isoDate.split('-').map(Number);
    const monthName = new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long' });

    await this.fieldGroup(label).locator('i.oxd-date-input-icon').click();
    const calendar = this.page.locator('.oxd-calendar-wrapper');
    await expect(calendar).toBeVisible();

    await calendar.locator('.oxd-calendar-selector-month-selected').click();
    await calendar.locator('.oxd-calendar-dropdown--option', { hasText: monthName }).click();

    await calendar.locator('.oxd-calendar-date-wrapper', { hasText: new RegExp(`^${day}$`) }).first().click();
    await expect(calendar).toBeHidden();
  }

  /** Submits the form, picking whichever leave type is first in the dropdown — never
   * hardcoded, since which types carry a balance varies per instance/run. */
  async apply(data: LeaveApplicationData): Promise<void> {
    await this.leaveTypeSelect().click();
    await this.page.locator('.oxd-select-dropdown .oxd-select-option').nth(1).click();

    await this.setDate('From Date', data.fromDate);
    await this.setDate('To Date', data.toDate);
    await this.fieldGroup('Comments').locator('textarea').fill(data.comment);

    // Picking the dates triggers an async balance/duration recalculation that can
    // briefly reflow the page (verified live) — let it settle before submitting, so the
    // click lands on the actual Apply button rather than a layout mid-shift.
    await this.page.waitForLoadState('networkidle');
    const applyButton = this.page.getByRole('button', { name: 'Apply' });
    const toast = this.page.getByText('Successfully Saved', { exact: true });

    // Verified live: a click on this button occasionally has no visible effect at all
    // (the form stays exactly as filled, no toast, no error — consistent with the public
    // demo's documented tendency to be slow/rate-limited under load, see
    // docs/ARCHITECTURE.md §9) rather than a real duplicate-submission path, since
    // nothing was ever sent. Retry the same click, backing off a little more each time.
    for (let attempt = 0; attempt < 4; attempt++) {
      await applyButton.click();
      const submitted = await toast
        .waitFor({ state: 'visible', timeout: 5_000 })
        .then(() => true)
        .catch(() => false);
      if (submitted) break;
      await this.page.waitForTimeout(2_000 * (attempt + 1));
    }
  }

  async expectApplicationSubmitted(): Promise<void> {
    await expect(this.page.getByText('Successfully Saved', { exact: true })).toBeVisible();
  }
}
