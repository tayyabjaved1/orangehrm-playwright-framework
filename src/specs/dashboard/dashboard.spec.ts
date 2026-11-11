import { test } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboard/dashboard.page';

test.describe('Dashboard', { tag: ['@smoke', '@ui'] }, () => {
  test('shows the key widgets for a logged-in user', async ({ page }) => {
    let dashboard: DashboardPage;

    await test.step('Data preparation and initialisation', async () => {
      dashboard = new DashboardPage(page);
    });

    await test.step('Open the dashboard', async () => {
      await dashboard.open();
    });

    await test.step('Verify the key widgets are visible', async () => {
      await dashboard.expectKeyWidgetsVisible();
    });
  });
});
