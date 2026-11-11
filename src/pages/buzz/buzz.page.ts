import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';

export class BuzzPage extends BasePage {
  readonly path = '/web/index.php/buzz/viewBuzz';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.breadcrumb('Buzz')).toBeVisible();
  }

  /** Verifies the post composer is present without typing into or submitting it (this module is read-only, see docs/MODULE_CATALOG.md). */
  async expectPostComposerVisible(): Promise<void> {
    await expect(this.page.getByRole('textbox', { name: "What's on your mind?" })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Post', exact: true })).toBeVisible();
  }

  /**
   * Verifies the feed area itself rendered — either at least one existing post, or the
   * explicit empty state. This is a shared public instance (see ARCHITECTURE.md §7): other
   * users' posts come and go, so a feed with zero posts right now is a legitimate real state,
   * not a failure to detect. `.orangehrm-buzz`/`.orangehrm-buzz-post-body-text` are raw CSS
   * fallbacks — individual feed posts expose no accessible role or distinguishing label/text.
   */
  async expectFeedContentVisible(): Promise<void> {
    const firstPost = this.page.locator('.orangehrm-buzz').first();
    const emptyState = this.page.getByText('No Posts Available', { exact: true });
    await expect(firstPost.or(emptyState)).toBeVisible();
    if (await firstPost.isVisible().catch(() => false)) {
      await expect(firstPost.locator('.orangehrm-buzz-post-body-text').first()).toBeVisible();
    }
  }
}
