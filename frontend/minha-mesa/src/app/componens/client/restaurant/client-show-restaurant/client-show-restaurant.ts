import { Component, DestroyRef, ElementRef, inject, Output, signal, ViewChild, ViewChildren } from '@angular/core';
import { RestaurantFactory } from '../../../../factory/restaurant.factory';
import { RestaurantResponseDTO } from '../../../../types/restaurant/restaurant-response';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageError } from '../../../message-error/message-error';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DayOfWeek, mapDayNumber } from '../../../../types/enums/day-of-week';
import { WorkingScheduleResponseDTO } from '../../../../types/working_schedule/working-schedule-response';
import { ClientShowRestaurantWorkingSchedules } from '../client-show-restaurant-working-schedules/client-show-restaurant-working-schedules';
import { gsap } from 'gsap/gsap-core';
import { ClientCreateReserve } from '../../reserve/client-create-reserve/client-create-reserve';



@Component({
  selector: 'app-client-show-restaurant',
  imports: [MessageError, ClientShowRestaurantWorkingSchedules, ClientCreateReserve, RouterLink],
  templateUrl: './client-show-restaurant.html',
  styleUrl: './client-show-restaurant.css',
})
export class ClientShowRestaurant {
  readonly restaurant = signal(<RestaurantResponseDTO> {});

  readonly weekDays: { value: DayOfWeek; label: string }[] = [
    { value: DayOfWeek.MONDAY, label: 'Segunda-feira' },
    { value: DayOfWeek.TUESDAY, label: 'Terça-feira' },
    { value: DayOfWeek.WEDNESDAY, label: 'Quarta-feira' },
    { value: DayOfWeek.THURSDAY, label: 'Quinta-feira' },
    { value: DayOfWeek.FRIDAY, label: 'Sexta-feira' },
    { value: DayOfWeek.SATURDAY, label: 'Sábado' },
    { value: DayOfWeek.SUNDAY, label: 'Domingo' },
  ];

  restaurantMock = RestaurantFactory.createMock();

  getInitials(name:string):string{
    return name
    .split(' ')
    .map(name => name[0])
    .join('')
  }

  @ViewChild('divWorkingSchedules')
  divWorkingSchedules!: ElementRef<HTMLElement>;

  

  @ViewChild('clientShowRestaurantWorkingSchedules')
  clientShowRestaurantWorkingSchedules!: ClientShowRestaurantWorkingSchedules


  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(){
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params =>{
      const id = Number(params.get('id'));
      if (Number.isInteger(id) && id > 0) {
        this.loadRestaurant(id);
      }
    })
  }

  buttonShowScheduleIsDisabled = signal(false);
  readonly reserveModalOpen = signal(false);

  showWorkingSchedulesOfRestaurant(show:boolean){
    
    if (show) {
      gsap.set(
        this.divWorkingSchedules.nativeElement,
        {
          display:'flex'
        }
      )
      gsap.to(
        this.divWorkingSchedules.nativeElement,
        {
          opacity:1,
          duration: .3
        }
      )
      this.clientShowRestaurantWorkingSchedules.showDiv(true)
    }
    else{
      console.log("Fechando div");
      
      this.buttonShowScheduleIsDisabled.set(true);
      gsap.to(
        this.divWorkingSchedules.nativeElement,
        {
          opacity:0,
          duration: .8,
          onComplete: () =>{
            this.clientShowRestaurantWorkingSchedules.showDiv(false)
            gsap.set(
              
              this.divWorkingSchedules.nativeElement,
              {
                display:'none'
              }
            )
            setTimeout(() => {this.buttonShowScheduleIsDisabled.set(false); console.log("Ta indos");
            }, 1000)
          }
        }
      )
    }
  }

  loadRestaurant(id: number) {
    this.utilityService.updateCurrentPageOfOwnerMenu(1)
    this.restaurantService.getRestaurantbyId(id).subscribe({
      next:(dado) =>{
        this.restaurant.set(dado);
      },error: (error:HttpErrorResponse) => {
        const showError = this.exceptionService.handlerRedirectExceptionResponse(error, UtilityService.pathsOfApplication.CLIENT_HOME);
        if (showError) {
          this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error))
        }
      }

    })
  }

  schedulesFor(day: DayOfWeek): WorkingScheduleResponseDTO[] {
    return this.restaurant()?.workingDays?.filter(schedule => schedule.dayOfWeek === day) ?? [];
  }

  isOpenNow(): boolean {
    const restaurant = this.restaurant();
    if (!restaurant?.active) {
      return false;
    }

    const now = new Date();
    const currentDay = mapDayNumber.get(now.getDay());
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const todaySchedules = restaurant.workingDays?.filter(schedule => schedule.dayOfWeek === currentDay) ?? [];

    if (todaySchedules.some(schedule => this.isWithinSchedule(currentMinutes, schedule.timeStart, schedule.timeEnd))) {
      return true;
    }

    const previousDay = mapDayNumber.get((now.getDay() + 6) % 7);
    const previousSchedules = restaurant.workingDays?.filter(schedule => schedule.dayOfWeek === previousDay) ?? [];
    return previousSchedules.some(schedule => {
      const startMinutes = this.timeToMinutes(schedule.timeStart);
      const endMinutes = this.timeToMinutes(schedule.timeEnd);
      return endMinutes < startMinutes && currentMinutes < endMinutes;
    });
  }

  private isWithinSchedule(currentMinutes: number, timeStart: string, timeEnd: string): boolean {
    const startMinutes = this.timeToMinutes(timeStart);
    const endMinutes = this.timeToMinutes(timeEnd);
    return endMinutes < startMinutes
      ? currentMinutes >= startMinutes
      : currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
