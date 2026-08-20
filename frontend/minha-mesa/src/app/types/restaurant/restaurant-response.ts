import { WorkingScheduleResponseDTO } from "../working_schedule/working-schedule-response";

export interface RestaurantResponseDTO{
    id:number;
    name:string;
    phone:string;
    address:string;
    active:boolean;
    workingDays:WorkingScheduleResponseDTO[];

}