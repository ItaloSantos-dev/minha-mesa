import { DayOfWeek } from "../enums/day-of-week";

export interface WorkingScheduleResponseDTO{
    id:number;
    dayOfWeek:DayOfWeek;
    timeStart:string;
    timeEnd:string;
}