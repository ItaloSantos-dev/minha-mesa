import { DayOfWeek } from "../enums/day-of-week";

export interface CreateWorkingScheduleRequestDTO{
    dayOfWeek:DayOfWeek;
    timeStart:string;
    timeEnd:string;
}