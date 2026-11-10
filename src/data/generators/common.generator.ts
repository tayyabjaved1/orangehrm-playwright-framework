import { faker } from '@faker-js/faker';

/** Shared runtime-data primitives. Every call returns a fresh value — callers never reuse one across records. */
export class CommonGenerator {
  static firstName(): string { return faker.person.firstName(); }
  static lastName(): string { return faker.person.lastName(); }
  static fullName(): string { return `${this.firstName()} ${this.lastName()}`; }

  /** A username unique enough that two concurrent runs against the shared demo instance won't collide. */
  static username(prefix = 'qe'): string { return `${prefix}_${faker.string.alphanumeric(10).toLowerCase()}`; }

  static email(): string { return faker.internet.email({ provider: 'example.com' }).toLowerCase(); }
  static password(): string { return `${faker.internet.password({ length: 10 })}1!`; }
  static phone(): string { return faker.string.numeric(10); }

  /** @param daysFromToday offset for a leave/application date range */
  static dateFromToday(daysFromToday: number): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return date;
  }

  /** Formats a Date as OrangeHRM's `yyyy-mm-dd` input format. */
  static isoDate(date: Date): string { return date.toISOString().slice(0, 10); }
}
