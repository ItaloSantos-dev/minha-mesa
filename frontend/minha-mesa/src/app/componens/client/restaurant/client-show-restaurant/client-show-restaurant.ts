import { Component, DestroyRef, ElementRef, inject, Output, signal, ViewChild, ViewChildren } from '@angular/core';
import { RestaurantResponseDTO } from '../../../../types/restaurant/restaurant-response';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { ActivatedRoute } from '@angular/router';
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

interface RestaurantReview {
  author: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
}

interface MenuHighlight {
  name: string;
  description: string;
  price: string;
  image: string;
}

@Component({
  selector: 'app-client-show-restaurant',
  imports: [MessageError, ClientShowRestaurantWorkingSchedules],
  templateUrl: './client-show-restaurant.html',
  styleUrl: './client-show-restaurant.css',
})
export class ClientShowRestaurant {
  readonly restaurant = signal(<RestaurantResponseDTO> {});
  readonly menuHighlights: MenuHighlight[] = [
    {
      name: 'Prato da casa',
      description: 'Uma sugestão especial preparada com ingredientes frescos.',
      price: 'R$ 42,90',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
    },
    {
      name: 'Favorito da mesa',
      description: 'Uma combinação saborosa para compartilhar bons momentos.',
      price: 'R$ 36,90',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=85',
    },
    {
      name: 'Doce momento',
      description: 'Uma sobremesa especial para fechar a refeição.',
      price: 'R$ 18,00',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=85',
    },
  ];
  readonly reviews: RestaurantReview[] = [
    {
      author: 'Mariana Costa',
      initials: 'MC',
      rating: 5,
      comment: 'Ambiente acolhedor e pratos muito bem preparados. Foi uma ótima experiência!',
      date: 'Há 2 dias',
    },
    {
      author: 'Rafael Oliveira',
      initials: 'RO',
      rating: 5,
      comment: 'Atendimento atencioso e comida deliciosa. Quero voltar em breve.',
      date: 'Há 1 semana',
    },
    {
      author: 'Camila Santos',
      initials: 'CS',
      rating: 4,
      comment: 'Lugar agradável, perfeito para aproveitar uma refeição com calma.',
      date: 'Há 2 semanas',
    },
  ];
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
    ]
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
