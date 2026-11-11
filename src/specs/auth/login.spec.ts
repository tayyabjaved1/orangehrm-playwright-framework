import { test } from '@playwright/test';
import { requireEnv } from '../../core/env';
import { LoginPage } from '../../pages/auth/login.page';
import { DashboardPage } from '../../pages/dashboard/dashboard.page';

test.describe('Auth - Login', { tag: ['@smoke', '@ui'] }, () => {
  test('logs in with valid credentials and lands on the dashboard', async ({ page }) => {
    let loginPage: LoginPage;
    let dashboard: DashboardPage;

    await test.step('Data preparation and initialisation', async () => {
      loginPage = new LoginPage(page);
      dashboard = new DashboardPage(page);
    });

    await test.step('Open the login page', async () => {
      await loginPage.open();
    });

    await test.step('Log in with valid Admin credentials', async () => {
      await loginPage.login(requireEnv('ADMIN_USERNAME'), requireEnv('ADMIN_PASSWORD'));
    });

    await test.step('Verify the dashboard loads', async () => {
      await dashboard.waitForLoaded();
      await dashboard.expectKeyWidgetsVisible();
    });
  });

  test('rejects an invalid password with an error and no navigation', async ({ page }) => {
    let loginPage: LoginPage;

    await test.step('Data preparation and initialisation', async () => {
      loginPage = new LoginPage(page);
    });

    await test.step('Open the login page', async () => {
      await loginPage.open();
    });

    await test.step('Attempt to log in with an invalid password', async () => {
      await loginPage.login(requireEnv('ADMIN_USERNAME'), 'not-the-real-password');
    });

    await test.step('Verify the invalid-credentials error is shown', async () => {
      await loginPage.expectInvalidCredentialsError();
    });

    await test.step('Verify the user is still on the login page', async () => {
      await loginPage.expectOnLoginPage();
    });
  });
});
