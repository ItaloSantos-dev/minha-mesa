export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

export enum DayOfWeekPTBR {
  SEGUNDA = "SEGUNDA",
  TERCA = "TERCA",
  QUARTA = "QUARTA",
  QUINTA = "QUINTA",
  SEXTA = "SEXTA",
  SABADO = "SABADO",
  DOMINGO = "DOMINGO"
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

export const reverseTraductionOfDayWeek = new Map<DayOfWeekPTBR, DayOfWeek>([
  [DayOfWeekPTBR.SEGUNDA, DayOfWeek.MONDAY],
  [DayOfWeekPTBR.TERCA, DayOfWeek.TUESDAY],
  [DayOfWeekPTBR.QUARTA, DayOfWeek.WEDNESDAY],
  [DayOfWeekPTBR.QUINTA, DayOfWeek.THURSDAY],
  [DayOfWeekPTBR.SEXTA, DayOfWeek.FRIDAY],
  [DayOfWeekPTBR.SABADO, DayOfWeek.SATURDAY],
  [DayOfWeekPTBR.DOMINGO, DayOfWeek.SUNDAY]
]);