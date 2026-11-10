import { CommonGenerator } from '../generators/common.generator';
import type { SystemUserData } from '../types/admin.types';

/** Builds fresh, collision-resistant System User data for the Admin > Add User form. */
export class UserFactory {
  static create(overrides: Partial<SystemUserData> = {}): SystemUserData {
    return {
      username: CommonGenerator.username('user'),
      password: CommonGenerator.password(),
      role: 'ESS',
      ...overrides,
    };
  }
}
