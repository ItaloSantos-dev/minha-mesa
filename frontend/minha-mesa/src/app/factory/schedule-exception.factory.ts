import { ScheduleExceptionResponseDTO } from '../types/schedule_exception/schedule-exception-response';

export class ScheduleExceptionFactory {
  private static readonly mocks: ScheduleExceptionResponseDTO[] = [
    { id: 1, date: '2026-10-02', reason: 'Manutenção da cozinha', active: true },
    { id: 2, date: '2026-10-07', reason: 'Evento privado no restaurante', active: true },
    { id: 3, date: '2026-10-12', reason: 'Feriado nacional', active: true },
    { id: 4, date: '2026-11-02', reason: 'Reforma do salão', active: true },
    { id: 5, date: '2026-12-25', reason: 'Recesso de Natal', active: false },
  ];

  static createMock(): ScheduleExceptionResponseDTO {
    return structuredClone(this.mocks[0]);
  }

  static createMocks(count = this.mocks.length): ScheduleExceptionResponseDTO[] {
    return Array.from({ length: count }, (_, index) => structuredClone(this.mocks[index % this.mocks.length]));
  }
}
