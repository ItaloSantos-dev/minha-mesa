import { ReserveResponseDTO } from "../../reserve/reserve-response";
import { RealTimeTablesData } from "./real-time-tables-data";

export interface DashboardResponseDTO{
    restaurantName: string;
    totalReservations: number;
    scheduledReservations: number;
    confirmedReservations: number;
    peoplesExpectedInDay: number;
    nextReservations: ReserveResponseDTO[];
    tablesTotalCount: number;
    tablesActiveCount: number;
    realTimeTablesData: RealTimeTablesData;
    dateOfDashboard: string
}