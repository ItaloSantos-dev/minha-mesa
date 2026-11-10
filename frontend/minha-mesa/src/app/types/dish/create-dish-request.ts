export interface CreateDishRequestDTO {
  name: string;
  dishCategory: number | null;
  description: string | null;
  preparationTime: number;
  price: number;
}
