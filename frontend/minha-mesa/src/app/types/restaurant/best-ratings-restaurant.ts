import { DishResponseDTO } from "../dish/dish-repsonse";
import { RateDishResponseDTO } from "../rate_dish/rate-dish-response";

export interface BestRatingsrestaurant{
    bestDishes: DishResponseDTO[];
    bestRatesDish:RateDishResponseDTO[];
}