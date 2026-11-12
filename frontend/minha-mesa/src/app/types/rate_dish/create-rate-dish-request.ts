export interface CreateRateDishRequestDTO {
  reserveDishId: number;
  rating: number;
  comment: string | null;
}