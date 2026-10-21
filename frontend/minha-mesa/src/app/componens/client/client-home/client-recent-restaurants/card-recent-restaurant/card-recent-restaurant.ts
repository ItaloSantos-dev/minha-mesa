import { Component, input } from '@angular/core';
import { RestaurantResponseDTO } from '../../../../../types/restaurant/restaurant-response';
import { WorkingScheduleResponseDTO } from '../../../../../types/working_schedule/working-schedule-response';
import { DayOfWeek, mapDayNumber } from '../../../../../types/enums/day-of-week';

@Component({
  selector: 'app-card-recent-restaurant',
  imports: [],
  templateUrl: './card-recent-restaurant.html',
  styleUrl: './card-recent-restaurant.css',
})
export class CardRecentRestaurant {
  restaurant = input.required<RestaurantResponseDTO>();
  restaurantIsOpen(workingDays:WorkingScheduleResponseDTO[]):boolean{
    const currentDay:number = new Date().getDay();
    const currentTime = new Date().getHours() *60 + new Date().getMinutes();

    for(let i = 0; i<workingDays.length; i++ ){
      const workingDay = workingDays[i];
      if (workingDay.dayOfWeek === mapDayNumber.get(currentDay)) {
        const [startHour, startMinute] = workingDay.timeStart.split(':').map(Number);
        const [endHour, endMinute] = workingDay.timeEnd.split(':').map(Number);
        const timeStart = startHour * 60 + startMinute;
        const timeEnd = endHour * 60 + endMinute;
        if (timeStart<=currentTime && timeEnd>currentTime)
          return true;
      }
    }

    return false;
  }
}
