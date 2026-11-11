import { test } from '@playwright/test';
import { EmployeeTimesheetsPage } from '../../pages/time/employee-timesheets.page';

test.describe('Time - View Employee Timesheets', { tag: ['@smoke', '@ui'] }, () => {
  test('shows the timesheets landing page with pending-action content', async ({ page }) => {
    let employeeTimesheets: EmployeeTimesheetsPage;

    await test.step('Data preparation and initialisation', async () => {
      employeeTimesheets = new EmployeeTimesheetsPage(page);
    });

    await test.step('Open the Time module', async () => {
      await employeeTimesheets.open();
    });

    await test.step('Verify the Select Employee section is visible', async () => {
      await employeeTimesheets.expectSelectEmployeeSectionVisible();
    });

    await test.step('Verify the Timesheets Pending Action grid is visible', async () => {
      await employeeTimesheets.expectPendingActionGridVisible();
    });
  });
});
