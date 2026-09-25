import { ReserveStatus } from "../enums/reserve-status";

export interface ReserveResponseDTO{
    id: number;
    clientName: string;
    restaurantName: string;
    tableNumber: number;
    date: string;
    dayOfWeek: string;
    timeStart: string;
    timeEnd: string;
    status: ReserveStatus;
    observation: string;
    peoples: number;
}