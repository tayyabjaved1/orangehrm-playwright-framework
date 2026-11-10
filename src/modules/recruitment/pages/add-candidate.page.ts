import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../../../core/base-page';
import type { CandidateData } from '../../../data/types/recruitment.types';

export class AddCandidatePage extends BasePage {
  readonly path = '/web/index.php/recruitment/addCandidate';

  constructor(page: Page) { super(page); }

  async waitForLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Add Candidate' })).toBeVisible();
  }

  // Email's <input> carries no accessible name of its own (placeholder is the generic "Type
  // here", shared with Contact Number on the same row) — the only reliable anchor is the real
  // "Email" <label> next to it, via the input group that contains it.
  private emailInput(): Locator {
    return this.page.locator('.oxd-input-group').filter({ has: this.page.getByText('Email', { exact: true }) }).locator('input');
  }

  async submit(candidate: CandidateData): Promise<void> {
    await this.page.getByRole('textbox', { name: 'First Name' }).fill(candidate.firstName);
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(candidate.lastName);
    await this.emailInput().fill(candidate.email);
    // Vacancy and Resume are both optional on this form (verified live: no asterisk on
    // Vacancy's label, no "required" marker on the Resume upload) — left unset.
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async expectSavedToastVisible(): Promise<void> {
    await expect(this.page.getByText('Successfully Saved', { exact: true })).toBeVisible();
  }

  /** Confirms the save landed on the new candidate's own detail page, showing its full name. */
  async expectCandidateDetailVisible(candidate: CandidateData): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Application Stage' })).toBeVisible();
    await expect(this.page.getByText(`${candidate.firstName} ${candidate.lastName}`, { exact: true })).toBeVisible();
  }
}
