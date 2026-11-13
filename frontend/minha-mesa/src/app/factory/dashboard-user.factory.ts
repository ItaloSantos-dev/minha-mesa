import { DashboardUserResponseDTO } from '../types/user/dashboard/dashboard-user-response';
import { RestaurantFactory } from './restaurant.factory';
import { ReserveFactory } from './reserve.factory';

export class DashboardUserFactory {
  static createMock(): DashboardUserResponseDTO {
    return {
      recentRestaurants: RestaurantFactory.createRecentMocks(),
      reservesToday: ReserveFactory.createDashboardTodayMocks(),
    };
  }

  static createMocks(count = 1): DashboardUserResponseDTO[] {
    return Array.from({ length: count }, () => this.createMock());
  }
}
