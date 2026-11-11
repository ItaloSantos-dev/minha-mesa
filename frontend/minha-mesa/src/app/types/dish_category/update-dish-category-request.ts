export interface UpdateDishCategoryResponseDTO {
  name: string | null;
  dishesToAdd: number[] | null;
  dishesToRemove: number[] | null;
  updateActive: boolean | null;
  removeAllDishsOfCategory: boolean | null;
}