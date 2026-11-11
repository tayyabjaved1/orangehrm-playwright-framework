import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../core/base-page';

export class LoginPage extends BasePage {
  readonly path = '/web/index.php/auth/login';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
  }

  // @param username the account's username
  // @param password the account's password
  async login(username: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.page.getByText('Invalid credentials', { exact: true })).toBeVisible();
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/auth\/login/);
  }
}
