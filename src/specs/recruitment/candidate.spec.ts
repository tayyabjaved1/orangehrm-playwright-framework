import { test } from '@playwright/test';
import { CandidateFactory } from '../../data/factories/candidate.factory';
import type { CandidateData } from '../../data/types/recruitment.types';
import { AddCandidatePage } from '../../pages/recruitment/add-candidate.page';
import { CandidateListPage } from '../../pages/recruitment/candidate-list.page';

test.describe('Recruitment - Add Candidate', { tag: ['@smoke', '@ui'] }, () => {
  test('adds a candidate, finds it in the list, then deletes it', async ({ page }) => {
    let candidate: CandidateData;
    let fullName: string;
    let addCandidate: AddCandidatePage;
    let candidateList: CandidateListPage;

    await test.step('Data preparation and initialisation', async () => {
      candidate = CandidateFactory.create();
      fullName = `${candidate.firstName} ${candidate.lastName}`;
      addCandidate = new AddCandidatePage(page);
      candidateList = new CandidateListPage(page);
    });

    await test.step('Add the candidate', async () => {
      await addCandidate.open();
      await addCandidate.submit(candidate);
    });

    await test.step('Verify the candidate was saved', async () => {
      await addCandidate.expectSavedToastVisible();
      await addCandidate.expectCandidateDetailVisible(candidate);
    });

    await test.step('Search for the candidate in the candidate list', async () => {
      await candidateList.open();
      await candidateList.searchByName(candidate.firstName);
      await candidateList.selectSearchSuggestion(fullName);
      await candidateList.submitSearch();
    });

    await test.step('Verify exactly one matching candidate is listed', async () => {
      await candidateList.expectCandidateListed(fullName);
    });

    await test.step('Delete the candidate', async () => {
      await candidateList.selectCandidateCheckbox(fullName);
      await candidateList.deleteSelected();
    });

    await test.step('Verify the candidate was deleted', async () => {
      await candidateList.expectDeletedToastVisible();
    });

    await test.step('Search for the deleted candidate again', async () => {
      await candidateList.searchByName(candidate.firstName);
    });

    await test.step('Verify the candidate no longer appears', async () => {
      await candidateList.expectNoMatchingCandidate();
    });
  });
});
