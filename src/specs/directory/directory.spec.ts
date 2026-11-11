import { test } from '@playwright/test';
import { DirectoryPage } from '../../pages/directory/directory.page';

test.describe('Directory - Search Employees', { tag: ['@smoke', '@ui'] }, () => {
  test('searches the employee directory by a common name fragment and verifies results render', async ({ page }) => {
    let directory: DirectoryPage;

    await test.step('Data preparation and initialisation', async () => {
      directory = new DirectoryPage(page);
    });

    await test.step('Open the Directory', async () => {
      await directory.open();
    });

    await test.step('Search the Employee Name field for a broad common letter', async () => {
      await directory.searchByName('a');
    });

    await test.step('Verify the search results render real content', async () => {
      await directory.expectResultsRendered();
    });
  });
});
