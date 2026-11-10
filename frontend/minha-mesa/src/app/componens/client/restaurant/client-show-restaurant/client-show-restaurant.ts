import { Component, DestroyRef, ElementRef, inject, Output, signal, ViewChild, ViewChildren } from '@angular/core';
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

  restaurantMock = {
    id: 1,
    name: "Molho Sem Água",
    phone: "(98) 99999-1111",
    address: "Rua das Flores, 120 - Centro",
    active: true,
    imagePerfilLink: "https://placehold.co/200x200",
    imageBannerLink: "https://placehold.co/1200x400",
    workingDays: [
      { id: 1, dayOfWeek: DayOfWeek.MONDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 2, dayOfWeek: DayOfWeek.TUESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 3, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 4, dayOfWeek: DayOfWeek.THURSDAY, timeStart: "18:00", timeEnd: "23:00" },
      { id: 5, dayOfWeek: DayOfWeek.FRIDAY, timeStart: "18:00", timeEnd: "00:00" },
      { id: 6, dayOfWeek: DayOfWeek.SATURDAY, timeStart: "18:00", timeEnd: "00:00" }
    ],
    bestRatings: {
      bestDishes: [
        {
          id: 1, name: "Hambúrguer da Casa", dishCategoryName: "Hambúrgueres", dishCategoryId: 1,
          restaurantName: "Molho Sem Água", restaurantId: 1, description: "Hambúrguer artesanal com molho especial.",
          preparationTime: 1200, rating: 4.9, price: 32.90, slug: "hamburguer-da-casa",
          imageLink: "https://placehold.co/400x300", active: true
        },
        {
          id: 2, name: "Batata Suprema", dishCategoryName: "Acompanhamentos", dishCategoryId: 2,
          restaurantName: "Molho Sem Água", restaurantId: 1, description: "Batatas crocantes com cheddar e bacon.",
          preparationTime: 900, rating: 4.8, price: 24.90, slug: "batata-suprema",
          imageLink: "https://placehold.co/400x300", active: true
        }
      ],
      bestRatesDish: [
        {
          id: 1, dishId: 1, clientName:'Agusto', dishName: "Hambúrguer da Casa", reserveId: 10,
          restaurantName: "Molho Sem Água", rating: 5, comment: "Simplesmente perfeito!"
        },
        {
          id: 2, dishId: 2, clientName:'Marcos', dishName: "Batata Suprema", reserveId: 11,
          restaurantName: "Molho Sem Água", rating: 5, comment: "Muito saborosa!"
        }
      ]
    }
  }

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
