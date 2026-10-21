export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

export const mapDayNumber = new Map<number, DayOfWeek>([
  [0, DayOfWeek.SUNDAY],
  [1, DayOfWeek.MONDAY],
  [2, DayOfWeek.TUESDAY],
  [3, DayOfWeek.WEDNESDAY],
  [4, DayOfWeek.THURSDAY],
  [5, DayOfWeek.FRIDAY],
  [6, DayOfWeek.SATURDAY]
]);