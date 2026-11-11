import { test } from '@playwright/test';
import { requireEnv } from '../../core/env';
import { MaintenancePage } from '../../pages/maintenance/maintenance.page';

// Read-only by design: Maintenance's only reachable destination past its
// credential gate is Purge Employee Records, a destructive action with no
// safe undo on this shared public instance. This journey stops at the gate
// itself — see docs/MODULE_CATALOG.md's Maintenance section.
test.describe('Maintenance - Administrator Access Gate', { tag: ['@regression', '@ui'] }, () => {
  test('shows the administrator access confirmation gate for the authenticated admin, without proceeding into any purge action', async ({ page }) => {
    let maintenance: MaintenancePage;
    let adminUsername: string;
    let adminPassword: string;

    await test.step('Data preparation and initialisation', async () => {
      maintenance = new MaintenancePage(page);
      adminUsername = requireEnv('ADMIN_USERNAME');
      adminPassword = requireEnv('ADMIN_PASSWORD');
    });

    await test.step('Open the Maintenance module', async () => {
      await maintenance.open();
    });

    await test.step('Verify the administrator access gate is shown', async () => {
      await maintenance.expectAdministratorAccessGateVisible();
    });

    await test.step('Verify the pre-filled username matches the authenticated admin account', async () => {
      await maintenance.expectUsernamePrefilled(adminUsername);
    });

    await test.step('Re-enter the admin password into the confirmation field', async () => {
      await maintenance.enterPassword(adminPassword);
    });

    await test.step('Verify the password was entered into the confirmation field', async () => {
      await maintenance.expectPasswordEntered(adminPassword);
    });

    // Intentionally stop here: clicking "Confirm" would navigate straight into
    // Purge Employee Records (a destructive action) with no safe sub-page to
    // land on instead. Never click Confirm/Cancel-adjacent purge affordances.
  });
});
