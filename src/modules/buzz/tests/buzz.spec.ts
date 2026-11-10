import { test } from '@playwright/test';
import { BuzzPage } from '../pages/buzz.page';

test.describe('Buzz - View Newsfeed', { tag: ['@smoke', '@ui'] }, () => {
  test('shows the newsfeed with the post composer and existing feed content', async ({ page }) => {
    let buzz: BuzzPage;

    await test.step('Data preparation and initialisation', async () => {
      buzz = new BuzzPage(page);
    });

    await test.step('Open the Buzz newsfeed', async () => {
      await buzz.open();
    });

    await test.step('Verify the post composer is visible', async () => {
      await buzz.expectPostComposerVisible();
    });

    await test.step('Verify existing feed content is visible', async () => {
      await buzz.expectFeedContentVisible();
    });
  });
});
