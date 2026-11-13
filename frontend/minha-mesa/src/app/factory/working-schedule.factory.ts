import { DayOfWeek } from '../types/enums/day-of-week';
import { WorkingScheduleResponseDTO } from '../types/working_schedule/working-schedule-response';

export class WorkingScheduleFactory {
  private static readonly mocks: WorkingScheduleResponseDTO[] = [
    { id: 1, dayOfWeek: DayOfWeek.MONDAY, timeStart: '11:00', timeEnd: '22:00' },
    { id: 2, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '11:00', timeEnd: '22:00' },
    { id: 3, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '11:00', timeEnd: '22:00' },
    { id: 4, dayOfWeek: DayOfWeek.THURSDAY, timeStart: '11:00', timeEnd: '22:00' },
    { id: 5, dayOfWeek: DayOfWeek.FRIDAY, timeStart: '11:00', timeEnd: '23:00' },
    { id: 6, dayOfWeek: DayOfWeek.SATURDAY, timeStart: '12:00', timeEnd: '23:00' },
    { id: 7, dayOfWeek: DayOfWeek.SUNDAY, timeStart: '12:00', timeEnd: '20:00' },

    { id: 8, dayOfWeek: DayOfWeek.MONDAY, timeStart: '18:00', timeEnd: '23:00' },
    { id: 9, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '18:00', timeEnd: '23:00' },
    { id: 10, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '18:00', timeEnd: '23:00' },
  ];

  static createMock(): WorkingScheduleResponseDTO {
    return structuredClone(this.mocks[0]);
  }

  static createMocks(count = this.mocks.length): WorkingScheduleResponseDTO[] {
    return Array.from({ length: count }, (_, index) => structuredClone(this.mocks[index % this.mocks.length]));
  }
}
