import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';

/**
 * The Performance module's landing page. `viewPerformanceModule` redirects to
 * this "Manage Reviews" / "Employee Reviews" search grid — there is no
 * separate "overview" page to land on.
 */
export class ManageReviewsPage extends BasePage {
  readonly path = '/web/index.php/performance/viewPerformanceModule';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.breadcrumb('Manage Reviews')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Employee Reviews', level: 5 })).toBeVisible();
  }

  /**
   * The search grid's column headers — stable regardless of whether any reviews exist.
   * No `exact: true`: the sortable columns (Employee, Review Period, Due Date, Review
   * Status) render a trailing space in their accessible name alongside the sort-icon
   * button, so a substring match is used for all seven instead of mixing exact/non-exact.
   */
  async expectReviewGridColumnsVisible(): Promise<void> {
    const grid = this.page.getByRole('table');
    await expect(grid.getByRole('columnheader', { name: 'Employee' })).toBeVisible();
    await expect(grid.getByRole('columnheader', { name: 'Job Title' })).toBeVisible();
    await expect(grid.getByRole('columnheader', { name: 'Sub Unit' })).toBeVisible();
    await expect(grid.getByRole('columnheader', { name: 'Review Period' })).toBeVisible();
    await expect(grid.getByRole('columnheader', { name: 'Due Date' })).toBeVisible();
    await expect(grid.getByRole('columnheader', { name: 'Review Status' })).toBeVisible();
    await expect(grid.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
  }

  /**
   * The grid's empty-state message. The shared demo instance currently has no
   * performance reviews configured, so this is the real, falsifiable content
   * rendered today (see docs/MODULE_CATALOG.md's Performance section).
   * `.first()` because OrangeHRM renders a duplicate off-screen copy for its
   * responsive/mobile layout — both share the same accessible text.
   */
  async expectNoRecordsFound(): Promise<void> {
    await expect(this.page.getByText('No Records Found', { exact: true }).first()).toBeVisible();
  }
}
