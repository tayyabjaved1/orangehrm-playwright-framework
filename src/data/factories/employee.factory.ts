import { CommonGenerator } from '../generators/common.generator';
import type { EmployeeData } from '../types/pim.types';

/** Builds fresh, collision-resistant PIM employee data for the Add Employee form. */
export class EmployeeFactory {
  static create(overrides: Partial<EmployeeData> = {}): EmployeeData {
    return {
      firstName: CommonGenerator.firstName(),
      lastName: CommonGenerator.lastName(),
      ...overrides,
    };
  }
}
