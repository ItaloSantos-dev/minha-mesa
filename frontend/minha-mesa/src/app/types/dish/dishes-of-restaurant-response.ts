import { DishCategoryResponseDTO } from "../dish_category/dish-category-response";
import { DishResponseDTO } from "./dish-repsonse";

export interface DishesOfRestauranteResponseDTO {
  categories: DishCategoryResponseDTO[];
  dishesWithoutCategories: DishResponseDTO[];
}