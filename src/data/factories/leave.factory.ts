import { CommonGenerator } from '../generators/common.generator';
import type { LeaveApplicationData } from '../types/leave.types';

/** Builds data for a single-day leave application, comfortably in the future to avoid
 * weekend/holiday edge cases, with a unique comment token so the spec can find its own
 * request later in My Leave without colliding with another concurrent user's data.
 *
 * The day offset is randomised (not fixed) so that two runs started on the same
 * calendar day don't both target the same date and trip OrangeHRM's "Overlapping Leave
 * Request" validation against each other, but stays within the current calendar year —
 * OrangeHRM's default leave period — since the entitlement this journey grants itself
 * (see `AddLeaveEntitlementPage`) is only valid for the current period; a date past it
 * fails with "Balance not sufficient" (verified live). */
export class LeaveFactory {
  static create(overrides: Partial<LeaveApplicationData> = {}): LeaveApplicationData {
    const today = new Date();
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const daysLeftInPeriod = Math.floor((endOfYear.getTime() - today.getTime()) / 86_400_000);
    const maxOffset = Math.max(7, daysLeftInPeriod - 3);
    const minOffset = Math.min(7, maxOffset);
    const offsetDays = minOffset + Math.floor(Math.random() * (maxOffset - minOffset + 1));
    const date = CommonGenerator.isoDate(CommonGenerator.dateFromToday(offsetDays));
    return {
      fromDate: date,
      toDate: date,
      comment: `QE automated leave request ${CommonGenerator.username()}`,
      ...overrides,
    };
  }
}
