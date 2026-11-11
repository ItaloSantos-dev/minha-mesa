import { DishResponseDTO } from "../types/dish/dish-repsonse";
import { RateDishResponseDTO } from "../types/rate_dish/rate-dish-response";
import { DishFactory } from "./dish-factory";
import { RateDishFactory } from "./rate-dish-factory";


export interface BestRatingsResponseDTO {
  bestDishes: DishResponseDTO[];
  bestRatesDish: RateDishResponseDTO[];
}

export class BestRatingsFactory {
  private static readonly mocks: BestRatingsResponseDTO[] = [
    {
      bestDishes: [
        DishFactory.createMock(),
        DishFactory.createMock(),
      ],
      bestRatesDish: [
        RateDishFactory.createMock(),
        RateDishFactory.createMock(),
      ],
    },
  ];

  static createMock(): BestRatingsResponseDTO {
    return structuredClone(this.mocks[0]);
  }

  static createMocks(count = this.mocks.length): BestRatingsResponseDTO[] {
    return Array.from(
      { length: count },
      (_, index) => structuredClone(this.mocks[index % this.mocks.length]),
    );
  }
}