export interface UpdateDishRequestDTO {
  name: string | null;
  dishCategory: number | null;
  description: string | null;
  preparationTime: number | null;
  price: number | null;
  active: boolean | null;
}