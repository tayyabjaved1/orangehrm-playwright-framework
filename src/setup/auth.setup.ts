import { test as setup, expect } from '@playwright/test';
import { requireEnv } from '../core/env';

const authFile = 'playwright/.auth/admin.json';

/** Logs in once through the real UI and saves the session so every other spec starts
 * already authenticated (Playwright's storageState reuse) instead of signing in per test. */
setup('authenticate as Admin', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');
  await page.getByPlaceholder('Username').fill(requireEnv('ADMIN_USERNAME'));
  await page.getByPlaceholder('Password').fill(requireEnv('ADMIN_PASSWORD'));
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/);
  await page.context().storageState({ path: authFile });
});
