import { Component, ElementRef, inject, input, output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RestaurantResponseDTO } from '../../../../types/restaurant/restaurant-response';
import { DayOfWeek, DayOfWeekPTBR, reverseTraductionOfDayWeek } from '../../../../types/enums/day-of-week';
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

  restaurantMock = {
    id: 1,
    name: "Molho Sem Água",
    phone: "(98) 99999-1111",
    address: "Rua das Flores, 120 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 1, dayOfWeek: DayOfWeek.MONDAY, timeStart: "08:00", timeEnd: "09:00" },
      { id: 2, dayOfWeek: DayOfWeek.MONDAY, timeStart: "10:30", timeEnd: "12:00" },
      { id: 3, dayOfWeek: DayOfWeek.MONDAY, timeStart: "14:00", timeEnd: "15:30" },
      { id: 4, dayOfWeek: DayOfWeek.MONDAY, timeStart: "16:30", timeEnd: "17:30" },
      { id: 5, dayOfWeek: DayOfWeek.MONDAY, timeStart: "06:00", timeEnd: "07:00" },
      { id: 6, dayOfWeek: DayOfWeek.MONDAY, timeStart: "07:00", timeEnd: "08:00" },
      { id: 7, dayOfWeek: DayOfWeek.MONDAY, timeStart: "09:00", timeEnd: "09:30" },
      { id: 8, dayOfWeek: DayOfWeek.MONDAY, timeStart: "09:30", timeEnd: "10:00" },
      { id: 9, dayOfWeek: DayOfWeek.MONDAY, timeStart: "12:00", timeEnd: "12:30" },
      { id: 10, dayOfWeek: DayOfWeek.MONDAY, timeStart: "12:30", timeEnd: "13:00" },
      { id: 11, dayOfWeek: DayOfWeek.MONDAY, timeStart: "13:00", timeEnd: "13:30" },
      { id: 12, dayOfWeek: DayOfWeek.MONDAY, timeStart: "13:30", timeEnd: "14:00" },
      { id: 13, dayOfWeek: DayOfWeek.MONDAY, timeStart: "15:30", timeEnd: "16:00" },
      { id: 14, dayOfWeek: DayOfWeek.MONDAY, timeStart: "16:00", timeEnd: "16:30" },
      { id: 15, dayOfWeek: DayOfWeek.MONDAY, timeStart: "17:30", timeEnd: "18:00" },
      { id: 16, dayOfWeek: DayOfWeek.MONDAY, timeStart: "18:00", timeEnd: "18:30" },
      { id: 17, dayOfWeek: DayOfWeek.MONDAY, timeStart: "18:30", timeEnd: "19:00" },
      { id: 18, dayOfWeek: DayOfWeek.MONDAY, timeStart: "19:00", timeEnd: "19:30" },
      { id: 19, dayOfWeek: DayOfWeek.MONDAY, timeStart: "19:30", timeEnd: "20:00" },
      { id: 20, dayOfWeek: DayOfWeek.MONDAY, timeStart: "20:00", timeEnd: "20:30" },
      { id: 21, dayOfWeek: DayOfWeek.MONDAY, timeStart: "20:30", timeEnd: "21:00" },
      { id: 22, dayOfWeek: DayOfWeek.MONDAY, timeStart: "21:00", timeEnd: "21:30" },
      { id: 23, dayOfWeek: DayOfWeek.MONDAY, timeStart: "21:30", timeEnd: "22:00" },
      { id: 24, dayOfWeek: DayOfWeek.MONDAY, timeStart: "22:00", timeEnd: "22:30" },

      { id: 5, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "08:00", timeEnd: "09:30" },
      { id: 6, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "11:00", timeEnd: "12:00" },
      { id: 7, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "14:30", timeEnd: "16:00" },
      { id: 8, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "18:00", timeEnd: "19:00" },

      { id: 9, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "08:00", timeEnd: "09:00" },
      { id: 10, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "10:00", timeEnd: "11:30" },
      { id: 11, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "13:00", timeEnd: "14:00" },
      { id: 12, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "16:30", timeEnd: "18:00" },

      { id: 13, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "09:00", timeEnd: "10:00" },
      { id: 14, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "11:30", timeEnd: "12:30" },
      { id: 15, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "14:00", timeEnd: "15:30" },
      { id: 16, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "17:00", timeEnd: "18:30" },

      { id: 17, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "08:00", timeEnd: "09:00" },
      { id: 18, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "10:30", timeEnd: "12:00" },
      { id: 19, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "14:00", timeEnd: "15:00" },
      { id: 20, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "16:30", timeEnd: "18:00" },

      { id: 21, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "08:00", timeEnd: "09:30" },
      { id: 22, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "10:00", timeEnd: "11:00" },
      { id: 23, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "13:00", timeEnd: "14:30" },
      { id: 24, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "15:30", timeEnd: "17:00" }
    ]
  }
  
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
