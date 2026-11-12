import { ReserveDishStatus } from "../enums/reserve-dish-status";

export interface ReserveDishResponseDTO {
  id: number;
  reserveId: number;
  dishId: number;
  dishPrice: number;
  quantity: number;
  quantityCompleted: number;
  quantityCanceled: number;
  quantityPending: number;
  priceFinal: number;
  createdAt: string;
  status: ReserveDishStatus;
}