import { test } from '@playwright/test';
import { ClaimPage } from '../../pages/claim/claim.page';

test.describe('Claim - View Employee Claims', { tag: ['@smoke', '@ui'] }, () => {
  test('loads the Employee Claims list with grid and Assign Claim action', async ({ page }) => {
    let claim: ClaimPage;

    await test.step('Data preparation and initialisation', async () => {
      claim = new ClaimPage(page);
    });

    await test.step('Open the Claim module', async () => {
      await claim.open();
    });

    await test.step('Verify the Employee Claims list is visible', async () => {
      await claim.expectEmployeeClaimsListVisible();
    });

    await test.step('Verify the claims grid column headers are visible', async () => {
      await claim.expectClaimsGridColumnsVisible();
    });

    await test.step('Verify the records found count is visible', async () => {
      await claim.expectRecordsFoundVisible();
    });

    await test.step('Verify the Assign Claim action is present', async () => {
      await claim.expectAssignClaimButtonVisible();
    });
  });
});
