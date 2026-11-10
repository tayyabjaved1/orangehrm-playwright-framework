import type { Locator, Page } from '@playwright/test';

/** Base class every page object extends: navigation, page-readiness contract and the shared data-testid lookup. */
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  /** The page's URL, relative to baseURL. Set by each page object. */
  abstract readonly path: string;

  /** Confirms the page has actually finished rendering, anchored on that page's own elements. */
  abstract waitForLoaded(): Promise<void>;

  async goto(): Promise<void> { await this.page.goto(this.path); }

  /** Navigates to the page and waits until it is ready to interact with. */
  async open(): Promise<void> {
    await this.goto();
    await this.waitForLoaded();
  }

  protected testId(id: string): Locator { return this.page.getByTestId(id); }

  /** The module breadcrumb/heading every OrangeHRM page shows at the top of its content area. */
  protected breadcrumb(name: string): Locator {
    return this.page.locator('.oxd-topbar-header-breadcrumb').getByText(name, { exact: true });
  }
}
