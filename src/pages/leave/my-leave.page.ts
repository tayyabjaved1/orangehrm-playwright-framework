import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';

/** `/leave/viewMyLeaveList` — the logged-in employee's own leave requests. */
export class MyLeavePage extends BasePage {
  readonly path = '/web/index.php/leave/viewMyLeaveList';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'My Leave List' })).toBeVisible();
  }

  /** The list has no comment search field — a request is located by matching its own
   * unique comment token against each row's rendered text (its accessible name). */
  private requestRow(comment: string): Locator {
    return this.page.getByRole('row', { name: comment });
  }

  /** The Status cell renders as e.g. "Pending Approval (1.00)" — the day count is part
   * of the same text node, so the status label is matched as a substring, not exactly. */
  async expectRequestListed(comment: string, status: string): Promise<void> {
    const row = this.requestRow(comment);
    await expect(row).toBeVisible();
    await expect(row.getByText(status)).toBeVisible();
  }

  /** Cancels the still-pending request identified by its unique comment token. Clicking
   * the row's own named "Cancel" action cancels it immediately — verified live, OrangeHRM
   * shows no further confirmation dialog for this action. */
  async cancelRequest(comment: string): Promise<void> {
    await this.requestRow(comment).getByRole('button', { name: 'Cancel', exact: true }).click();
  }
}
