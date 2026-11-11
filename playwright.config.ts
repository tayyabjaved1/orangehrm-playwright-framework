import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

if (existsSync('.env')) process.loadEnvFile('.env');

const baseURL = process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com';

export default defineConfig({
  testDir: './src',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false, detail: true }],
  ],
  use: {
    baseURL,
    headless: process.env.HEADLESS !== 'false',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    // Logs in once through the real UI; every other project depends on this and reuses its session.
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      // Auth module tests the login form itself, so they must not start pre-authenticated.
      name: 'chromium-auth',
      testMatch: '**/specs/auth/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium',
      testIgnore: '**/specs/auth/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/admin.json' },
      dependencies: ['setup'],
    },
  ],
});
