import { DishResponseDTO } from "../dish/dish-repsonse";

export interface DishCategoryResponseDTO {
  id: number;
  restaurantId: string;
  name: string;
  imageLink: string;
  active: boolean;
  slug: string;
  dishes: DishResponseDTO[];
}