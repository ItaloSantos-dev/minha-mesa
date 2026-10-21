import { ReserveResponseDTO } from "../../reserve/reserve-response";
import { RestaurantResponseDTO } from "../../restaurant/restaurant-response";

export interface DashboardUserResponseDTO{
    recentRestaurants: RestaurantResponseDTO[],
    reservesToday: ReserveResponseDTO[];
}