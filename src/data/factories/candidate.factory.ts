import { CommonGenerator } from '../generators/common.generator';
import type { CandidateData } from '../types/recruitment.types';

/**
 * Builds fresh, collision-resistant Recruitment candidate data for the Add Candidate form.
 *
 * The Candidates list searches by first-name prefix only (verified live), and this is a
 * long-lived shared instance with many repeated plain faker first names already on file
 * (e.g. several "John Doe" candidates) — a plain `CommonGenerator.firstName()` could match
 * more than one existing record. `firstName` therefore reuses `CommonGenerator.username()`'s
 * collision-resistant suffix so a spec's name search always resolves to exactly one row.
 */
export class CandidateFactory {
  static create(overrides: Partial<CandidateData> = {}): CandidateData {
    return {
      firstName: CommonGenerator.username('candidate'),
      lastName: CommonGenerator.lastName(),
      email: CommonGenerator.email(),
      ...overrides,
    };
  }
}
