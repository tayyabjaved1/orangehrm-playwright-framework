import { test } from '@playwright/test';
import { ManageReviewsPage } from '../pages/manage-reviews.page';

test.describe('Performance - View Reviews', { tag: ['@smoke', '@ui'] }, () => {
  test('opens the Performance module and shows the reviews grid', async ({ page }) => {
    let manageReviews: ManageReviewsPage;

    await test.step('Data preparation and initialisation', async () => {
      manageReviews = new ManageReviewsPage(page);
    });

    await test.step('Open the Performance module', async () => {
      await manageReviews.open();
    });

    await test.step('Verify the reviews grid columns are visible', async () => {
      await manageReviews.expectReviewGridColumnsVisible();
    });

    await test.step('Verify the empty-state message is visible', async () => {
      await manageReviews.expectNoRecordsFound();
    });
  });
});
