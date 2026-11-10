import { test } from '@playwright/test';
import { UserFactory } from '../../../data/factories/user.factory';
import type { SystemUserData } from '../../../data/types/admin.types';
import { AddUserPage } from '../pages/add-user.page';
import { SystemUserListPage } from '../pages/system-user-list.page';

test.describe('Admin - System Users', { tag: ['@smoke', '@ui'] }, () => {
  test('adds a system user, verifies it in the grid, and deletes it', async ({ page }) => {
    let user: SystemUserData;
    let addUser: AddUserPage;
    let systemUserList: SystemUserListPage;

    await test.step('Data preparation and initialisation', async () => {
      user = UserFactory.create();
      addUser = new AddUserPage(page);
      systemUserList = new SystemUserListPage(page);
    });

    await test.step('Add the system user', async () => {
      await addUser.open();
      await addUser.addUser(user);
    });

    await test.step('Verify the system user was created successfully', async () => {
      await addUser.expectSuccessToast();
    });

    await test.step('Search the system user list for the new user', async () => {
      await systemUserList.open();
      await systemUserList.searchByUsername(user.username);
    });

    await test.step('Verify the new user appears in the grid', async () => {
      await systemUserList.expectUserListed(user.username);
    });

    await test.step('Delete the system user', async () => {
      await systemUserList.deleteUser(user.username);
    });

    await test.step('Search again for the deleted user', async () => {
      await systemUserList.searchByUsername(user.username);
    });

    await test.step('Verify the user no longer appears in the grid', async () => {
      await systemUserList.expectUserNotListed(user.username);
    });
  });
});
