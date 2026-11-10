import { test } from '@playwright/test';
import { LeaveFactory } from '../../../data/factories/leave.factory';
import type { LeaveApplicationData } from '../../../data/types/leave.types';
import { AddLeaveEntitlementPage } from '../pages/add-leave-entitlement.page';
import { ApplyLeavePage } from '../pages/apply-leave.page';
import { MyLeavePage } from '../pages/my-leave.page';

// The logged-in Admin's own employee, "John Mike Doe" — verified live via My Info
// (empNumber 7). Leave is assigned/searched against this exact full name.
const EMPLOYEE_NAME = 'John Mike Doe';

test.describe('Leave - Apply and Cancel Leave Request', { tag: ['@smoke', '@ui'] }, () => {
  test('applies for leave, verifies it in My Leave, then cancels it', async ({ page }) => {
    let leave: LeaveApplicationData;
    let entitlement: AddLeaveEntitlementPage;
    let applyLeave: ApplyLeavePage;
    let myLeave: MyLeavePage;

    await test.step('Data preparation and initialisation', async () => {
      leave = LeaveFactory.create();
      entitlement = new AddLeaveEntitlementPage(page);
      applyLeave = new ApplyLeavePage(page);
      myLeave = new MyLeavePage(page);
    });

    // The live demo's Admin account carries zero leave balance for every leave type, so
    // Apply Leave renders no form at all until a balance exists (verified live) — grant
    // one for the same employee before applying. See the module README for detail.
    await test.step('Grant a leave entitlement for the current employee', async () => {
      await entitlement.open();
      await entitlement.grantEntitlementForFirstAvailableLeaveType(EMPLOYEE_NAME, 5);
    });

    await test.step('Verify the leave entitlement was granted', async () => {
      await entitlement.expectEntitlementGranted();
    });

    await test.step('Apply for leave', async () => {
      await applyLeave.open();
      await applyLeave.apply(leave);
    });

    await test.step('Verify the leave application was submitted', async () => {
      await applyLeave.expectApplicationSubmitted();
    });

    await test.step('Open My Leave', async () => {
      await myLeave.open();
    });

    await test.step('Verify the leave request appears with Pending Approval status', async () => {
      await myLeave.expectRequestListed(leave.comment, 'Pending Approval');
    });

    await test.step('Cancel the leave request', async () => {
      await myLeave.cancelRequest(leave.comment);
    });

    await test.step('Verify the leave request status is now Cancelled', async () => {
      await myLeave.expectRequestListed(leave.comment, 'Cancelled');
    });
  });
});
