import { test } from '@playwright/test';
import { EmployeeFactory } from '../../../data/factories/employee.factory';
import { AddEmployeePage } from '../pages/add-employee.page';
import { EmployeeDetailsPage } from '../pages/employee-details.page';
import { EmployeeListPage } from '../pages/employee-list.page';

test.describe('PIM - Add Employee', { tag: ['@regression', '@ui'] }, () => {
  test('adds an employee, verifies it in the list, then deletes it', async ({ page }) => {
    let employee: ReturnType<typeof EmployeeFactory.create>;
    let addEmployee: AddEmployeePage;
    let employeeDetails: EmployeeDetailsPage;
    let employeeList: EmployeeListPage;

    await test.step('Data preparation and initialisation', async () => {
      employee = EmployeeFactory.create();
      addEmployee = new AddEmployeePage(page);
      employeeDetails = new EmployeeDetailsPage(page);
      employeeList = new EmployeeListPage(page);
    });

    await test.step('Add the employee', async () => {
      await addEmployee.open();
      await addEmployee.submit(employee);
    });

    await test.step('Verify the new employee is shown on their Personal Details page', async () => {
      await employeeDetails.waitForLoaded();
      await employeeDetails.expectDisplaysEmployee(employee);
    });

    await test.step('Verify the employee appears in the employee list', async () => {
      await employeeList.open();
      await employeeList.expectEmployeeListed(employee);
    });

    await test.step('Delete the employee', async () => {
      await employeeList.deleteEmployee(employee);
    });

    await test.step('Verify the employee no longer appears in the list', async () => {
      await employeeList.expectEmployeeNotListed(employee);
    });
  });
});
