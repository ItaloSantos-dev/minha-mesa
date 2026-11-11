import { Component, ElementRef, inject, input, output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { RestaurantFactory } from '../../../../factory/restaurant.factory';
import { CommonModule, DatePipe } from '@angular/common';
import { RestaurantResponseDTO } from '../../../../types/restaurant/restaurant-response';
import { DayOfWeekPTBR, reverseTraductionOfDayWeek } from '../../../../types/enums/day-of-week';
import { WorkingScheduleResponseDTO } from '../../../../types/working_schedule/working-schedule-response';
import { gsap } from 'gsap/gsap-core';
import { MessageError } from '../../../message-error/message-error';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { UtilityService } from '../../../../service/utility-service/utility-service';
interface DaySlot{
  day:DayOfWeekPTBR;
  id:number;
}


@Component({
  selector: 'app-client-show-restaurant-working-schedules',
  imports: [DatePipe, MessageError],
  providers:[DatePipe],
  templateUrl: './client-show-restaurant-working-schedules.html',
  styleUrl: './client-show-restaurant-working-schedules.css',
})
export class ClientShowRestaurantWorkingSchedules {
  selectedDate: Date | null = new Date(2025, 5, 12);
  selectDay: DayOfWeekPTBR | null = DayOfWeekPTBR.SEGUNDA;
  restaurant = input.required<RestaurantResponseDTO>();
  utilityService = inject(UtilityService)

  restaurantMock = RestaurantFactory.createWorkingSchedulesMock();
  
  daySlots: DaySlot[] = [
    { day: DayOfWeekPTBR.SEGUNDA, id: 1 },
    { day: DayOfWeekPTBR.TERCA, id: 2 },
    { day: DayOfWeekPTBR.QUARTA, id: 3 },
    { day: DayOfWeekPTBR.QUINTA, id: 4 },
    { day: DayOfWeekPTBR.SEXTA, id: 5 },
    { day: DayOfWeekPTBR.SABADO, id: 6 },
    { day: DayOfWeekPTBR.DOMINGO, id: 7 }
  ];
  bookedDates: Date[] = [];
  
  // Basic calendar generation state
  currentMonth: Date = new Date(2025, 5, 1); // June 2025
  calendarDays: { date: Date; isBooked: boolean; isOutside: boolean }[] = [];

  timesReserves: WorkingScheduleResponseDTO[] = [];

  closeDiv = output<void>()

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    if (this.restaurant()===null) {
      const exception:ExceptionResponse = {status:500, menssage:"Ocorreu um erro inesprado. Tente novamente mais tarde!"}
      this.utilityService.handlerShowMenssageErrorSubject(exception);
    }
    this.loadTimeReserves();
    this.generateBookedDates();
  }

  
  loadTimeReserves(){
    if (!this.selectDay)
      return;
    const dayOfWeekSelected = reverseTraductionOfDayWeek.get(this.selectDay)
    if (this.restaurant().workingDays) {
      this.timesReserves = this.restaurant().workingDays.filter( wd => wd.dayOfWeek === dayOfWeekSelected).sort( (a,b) => a.timeStart.localeCompare(b.timeStart));
    }
  }
  
  @ViewChild('main')
  main!: ElementRef<HTMLElement>;

  @ViewChildren('divDay')
  divDays!: QueryList<ElementRef<HTMLElement>>

  animateDivDays(show: boolean) {
    gsap.to(
      this.divDays.map(div => div.nativeElement),
      {
        x: show ? '0%' : '-100%',
        duration: 0.4,
        stagger: 0.15,
        ease: 'power2.out'
      }
    );
  }

  showDiv(show:boolean){
    console.log("Exibindo");
    
    if (show) {
      gsap.to(
        this.main.nativeElement,
        {
          opacity:1,
          duration:.6,
        }
      )
      this.animateDivDays(show)
    }
    else{
      this.animateDivDays(show)
      gsap.to(
        this.main.nativeElement,
        {
          opacity:0,
          duration:.6
        }
      )
    }
  }

  

  generateBookedDates() {
    this.bookedDates = Array.from(
      { length: 3 },
      (_, i) => new Date(2025, 5, 17 + i)
    );
  }

  

  selectDate(day: { date: Date; isBooked: boolean; isOutside: boolean }) {
    if (day.isBooked || day.isOutside) return;
    this.selectedDate = day.date;
  }

  handlerSelectDay(dayPtbr: DayOfWeekPTBR) {
    this.selectDay = dayPtbr;
    this.loadTimeReserves();
  }

  isSelectedDate(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

  getFormattedDate(): string {
    if (!this.selectedDate) return '';
    return this.datePipe.transform(this.selectedDate, 'EEEE, MMMM d') || '';
  }
}
