import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../../core/base-page';

export class CandidateListPage extends BasePage {
  readonly path = '/web/index.php/recruitment/viewRecruitmentModule';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Candidates' })).toBeVisible();
  }

  // OrangeHRM's candidate name field is a type-ahead bound to real records, not a free-text
  // filter — typing a name that matches nothing never reaches the grid, so the search flow is
  // split into: type (searchByName), then either select a real suggestion and submit, or
  // assert no suggestion exists (expectNoMatchingCandidate).
  async searchByName(name: string): Promise<void> {
    await this.page.getByPlaceholder('Type for hints...').fill(name);
  }

  /** Clicks the matching candidate-name-search suggestion. Call after `searchByName`. */
  async selectSearchSuggestion(fullName: string): Promise<void> {
    await this.autocompleteOption(fullName).click();
  }

  async submitSearch(): Promise<void> {
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  /** @param fullName the candidate's exact "firstName lastName" as shown in the grid */
  private row(fullName: string): Locator {
    return this.page.getByRole('row').filter({ hasText: fullName });
  }

  // The type-ahead's suggestion list has no accessible role/label of its own (just a styled
  // div), so matching its option text is the only way to pick the right suggestion.
  private autocompleteOption(fullName: string): Locator {
    return this.page.locator('.oxd-autocomplete-option', { hasText: fullName });
  }

  async expectCandidateListed(fullName: string): Promise<void> {
    await expect(this.row(fullName)).toHaveCount(1);
    await expect(this.row(fullName)).toBeVisible();
  }

  /** Asserts the name search's own suggestion list reports no match — used post-delete, since a
   *  deleted candidate's name no longer resolves to a selectable suggestion at all. */
  async expectNoMatchingCandidate(): Promise<void> {
    await expect(this.page.getByText('No Records Found', { exact: true })).toBeVisible();
  }

  // The checkbox's custom icon overlay intercepts pointer events on the real <input>, so the
  // click must target the styled wrapper OrangeHRM renders instead (documented Vue component
  // quirk — the input itself is never clickable).
  async selectCandidateCheckbox(fullName: string): Promise<void> {
    await this.row(fullName).locator('.oxd-checkbox-input').first().click();
  }

  async deleteSelected(): Promise<void> {
    await this.page.getByRole('button', { name: 'Delete Selected' }).click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
  }

  async expectDeletedToastVisible(): Promise<void> {
    await expect(this.page.getByText('Successfully Deleted', { exact: true })).toBeVisible();
  }
}
