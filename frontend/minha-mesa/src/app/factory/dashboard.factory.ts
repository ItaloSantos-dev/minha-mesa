import { DashboardResponseDTO } from '../types/restaurant/dashboard/dashboard-response';
import { ReserveFactory } from './reserve.factory';

export class DashboardFactory {
  static createMock(): DashboardResponseDTO {
    return {
      restaurantName: 'Sonho na cozinha',
      totalReservations: 25,
      scheduledReservations: 10,
      confirmedReservations: 12,
      peoplesExpectedInDay: 38,
      tablesTotalCount: 15,
      tablesActiveCount: 12,
      realTimeTablesData: {
      tablesOccupied: 5,
      tablesFree: 7,
      dataAndTimeFetchedAt: '2026-09-24T20:19:35.899157761-03:00'
    },
      dateOfDashboard: '2026-09-24',
      nextReservations: ReserveFactory.createDashboardNextMocks(),
    };
  }

  static createMocks(count = 1): DashboardResponseDTO[] {
    return Array.from({ length: count }, () => this.createMock());
  }
}
