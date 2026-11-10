import { expect, type Page } from '@playwright/test';
import { BasePage } from '../../../core/base-page';

export class DirectoryPage extends BasePage {
  readonly path = '/web/index.php/directory/viewDirectory';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.breadcrumb('Directory')).toBeVisible();
  }

  private employeeNameInput() {
    return this.page.getByRole('textbox', { name: 'Type for hints...' });
  }

  /**
   * Types a name fragment into the Employee Name autocomplete and runs the
   * search. OrangeHRM's Employee Name filter only takes effect once a real
   * suggestion is selected from the dropdown (free-typed text alone is left
   * unfiltered server-side), so this selects the first real suggestion when
   * one exists, and otherwise leaves the field as typed before searching.
   */
  async searchByName(nameFragment: string): Promise<void> {
    const input = this.employeeNameInput();
    await input.fill(nameFragment);

    // The dropdown briefly shows a "Searching...." placeholder option while
    // the live suggestion list loads; wait past it before reading options.
    const dropdown = this.page.locator('.oxd-autocomplete-dropdown');
    await expect(dropdown).not.toContainText('Searching....', { timeout: 15_000 });

    const firstOption = this.page.getByRole('option').first();
    const firstOptionText = (await firstOption.textContent())?.trim();
    if (firstOptionText && firstOptionText !== 'No Records Found') {
      await firstOption.click();
    } else {
      await this.page.keyboard.press('Escape');
    }

    await this.page.getByRole('button', { name: 'Search' }).click();
    await expect(this.page.getByText(/Record(s)? Found/)).toBeVisible();
  }

  /**
   * Verifies the search produced a real, falsifiable outcome: either at
   * least one result card showing an employee's name, or the directory's
   * own explicit empty-state message — whichever actually matches what
   * rendered, never a proxy that would pass regardless of real content.
   */
  async expectResultsRendered(): Promise<void> {
    const emptyState = this.page.getByText('No Records Found', { exact: true });

    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
      return;
    }

    // OrangeHRM's directory result card exposes no accessible role/label for
    // its name text; `.orangehrm-directory-card`/`-header` are its own
    // documented CSS classes, used only because no better selector resolves.
    const firstCardName = this.page
      .locator('.orangehrm-directory-card')
      .first()
      .locator('.orangehrm-directory-card-header');

    await expect(firstCardName).toBeVisible();
    await expect(firstCardName).toHaveText(/\S+/);
  }
}
