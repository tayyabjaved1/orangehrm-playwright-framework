import { test } from '@playwright/test';
import { PersonalDetailsPage } from '../../pages/my-info/personal-details.page';

test.describe('My Info - View Personal Details', { tag: ['@smoke', '@ui'] }, () => {
  test('shows the logged-in user\'s own Personal Details with real employee content', async ({ page }) => {
    let personalDetails: PersonalDetailsPage;

    await test.step('Data preparation and initialisation', async () => {
      personalDetails = new PersonalDetailsPage(page);
    });

    await test.step('Open My Info', async () => {
      await personalDetails.open();
    });

    await test.step('Verify the logged-in user\'s own employee identity is visible', async () => {
      await personalDetails.expectOwnEmployeeIdentityVisible();
    });
  });
});
