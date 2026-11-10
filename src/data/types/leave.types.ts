/** Data needed to submit a single-day leave application through the Apply Leave form. */
export interface LeaveApplicationData {
  /** ISO `yyyy-mm-dd` — the leave's first (and, for this journey, only) day. */
  fromDate: string;
  /** ISO `yyyy-mm-dd` — set equal to `fromDate` for a single-day request. */
  toDate: string;
  /** Contains a unique token so this specific request can be found later in My Leave. */
  comment: string;
}
