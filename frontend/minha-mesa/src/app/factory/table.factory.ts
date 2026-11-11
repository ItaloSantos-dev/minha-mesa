import { TableResponseDTO } from '../types/table/table-response';

export class TableFactory {
  private static readonly mocks: TableResponseDTO[] = [
    { id: 1, number: 1, capacity: 2, active: false },
    { id: 2, number: 2, capacity: 4, active: true },
    { id: 3, number: 3, capacity: 6, active: true },
    { id: 4, number: 4, capacity: 4, active: true },
    { id: 5, number: 5, capacity: 8, active: true },
  ];

  static createMock(): TableResponseDTO {
    return structuredClone(this.mocks[0]);
  }

  static createMocks(count = this.mocks.length): TableResponseDTO[] {
    return Array.from({ length: count }, (_, index) => structuredClone(this.mocks[index % this.mocks.length]));
  }
}
