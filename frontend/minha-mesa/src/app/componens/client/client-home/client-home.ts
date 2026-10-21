import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReserveResponseDTO } from '../../../types/reserve/reserve-response';
import { ReserveStatus } from '../../../types/enums/reserve-status';
import { UserService } from '../../../service/user-service/user-service';
import { MessageError } from '../../message-error/message-error';
import { UtilityService } from '../../../service/utility-service/utility-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionService } from '../../../service/exception-service/exception-service';
import { ExceptionResponse } from '../../../types/exception/excpetion-response';
import { DashboardResponseDTO } from '../../../types/restaurant/dashboard/dashboard-response';
import { DashboardUserResponseDTO } from '../../../types/user/dashboard/dashboard-user-response';
import { ClientRecentRestaurants } from './client-recent-restaurants/client-recent-restaurants';
import { DayOfWeek } from '../../../types/enums/day-of-week';

@Component({
  selector: 'app-client-home',
  imports: [MessageError, ClientRecentRestaurants],
  templateUrl: './client-home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientHome {


  private readonly userService = inject(UserService);

  private readonly utilityService = inject(UtilityService);

  private readonly exceptionService = inject(ExceptionService);

  dashboardUser = signal<DashboardUserResponseDTO>({
    recentRestaurants: [],
    reservesToday: [],
  });

  

  private readonly todayDate = new Date();

  readonly todayDateKey = [
    this.todayDate.getFullYear(),
    String(this.todayDate.getMonth() + 1).padStart(2, '0'),
    String(this.todayDate.getDate()).padStart(2, '0'),
  ].join('-');

  readonly todayLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(this.todayDate);

  

  readonly expectedPeople = computed(() =>
    this.dashboardUser().reservesToday.reduce((total, reserve) => total + reserve.peoples, 0),
  );

  getStatusLabel(status: ReserveStatus): string {
    const labels: Record<ReserveStatus, string> = {
      [ReserveStatus.SCHEDULED]: 'Agendada',
      [ReserveStatus.CONFIRMED]: 'Confirmada',
      [ReserveStatus.CANCELED]: 'Cancelada',
      [ReserveStatus.COMPLETED]: 'Concluída',
      [ReserveStatus.NO_SHOW]: 'Não compareceu',
    };

    return labels[status];
  }

  getInitialRestaurantName(name:string):string{
    return name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
  }

  getStatusClass(status: ReserveStatus): string {
    const classes: Record<ReserveStatus, string> = {
      [ReserveStatus.SCHEDULED]: 'bg-[#fff2c9] text-[#876200]',
      [ReserveStatus.CONFIRMED]: 'bg-[#e1f3e8] text-[#28734a]',
      [ReserveStatus.CANCELED]: 'bg-[#fde5e2] text-[#a23b31]',
      [ReserveStatus.COMPLETED]: 'bg-[#e3edf5] text-[#236184]',
      [ReserveStatus.NO_SHOW]: 'bg-[#f1e4ef] text-[#82436f]',
    };

    return classes[status];
  }

  showButonForCanceledReserve(reserve:ReserveResponseDTO):boolean{
    if (reserve.status === ReserveStatus.CANCELED ||
        reserve.status === ReserveStatus.COMPLETED ||
        reserve.status === ReserveStatus.NO_SHOW
    ) {
      return false;
    }
    const currentDate = new Date();
    const limitDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);


    if (new Date(reserve.date) <= limitDate)
      return false
    
    return true;
  }

  dashboardUserMock: DashboardUserResponseDTO = {
  recentRestaurants: [
    {
      id: 1,
      name: 'Pizzaria Bella Napoli',
      phone: '(99) 99123-4567',
      address: 'Av. Castelo Branco, 120, Centro',
      active: true,
      imagePerfilLink: 'https://placehold.co/200x200?text=Bella+Napoli',
      imageBannerLink: 'https://placehold.co/800x400?text=Bella+Napoli',
      workingDays: [
        {
          id: 1,
          dayOfWeek: DayOfWeek.MONDAY,
          timeStart: '18:00',
          timeEnd: '23:00'
        },
        {
          id: 2,
          dayOfWeek: DayOfWeek.TUESDAY,
          timeStart: '18:00',
          timeEnd: '23:00'
        },
        {
          id: 3,
          dayOfWeek: DayOfWeek.WEDNESDAY,
          timeStart: '17:00',
          timeEnd: '18:00'
        },
        {
          id: 4,
          dayOfWeek: DayOfWeek.THURSDAY,
          timeStart: '18:00',
          timeEnd: '23:00'
        },
        {
          id: 5,
          dayOfWeek: DayOfWeek.FRIDAY,
          timeStart: '18:00',
          timeEnd: '00:00'
        },
        {
          id: 6,
          dayOfWeek: DayOfWeek.SATURDAY,
          timeStart: '18:00',
          timeEnd: '00:00'
        }
      ]
    },
    {
      id: 2,
      name: 'Sushi House',
      phone: '(99) 99234-5678',
      address: 'Rua das Flores, 45, Centro',
      active: true,
      imagePerfilLink: 'https://placehold.co/200x200?text=Sushi+House',
      imageBannerLink: 'https://placehold.co/800x400?text=Sushi+House',
      workingDays: [
        {
          id: 7,
          dayOfWeek: DayOfWeek.TUESDAY,
          timeStart: '11:00',
          timeEnd: '14:30'
        },
        {
          id: 8,
          dayOfWeek: DayOfWeek.WEDNESDAY,
          timeStart: '11:00',
          timeEnd: '14:30'
        },
        {
          id: 9,
          dayOfWeek: DayOfWeek.THURSDAY,
          timeStart: '11:00',
          timeEnd: '14:30'
        },
        {
          id: 10,
          dayOfWeek: DayOfWeek.FRIDAY,
          timeStart: '18:00',
          timeEnd: '23:00'
        },
        {
          id: 11,
          dayOfWeek: DayOfWeek.SATURDAY,
          timeStart: '18:00',
          timeEnd: '23:00'
        },
        {
          id: 12,
          dayOfWeek: DayOfWeek.SUNDAY,
          timeStart: '18:00',
          timeEnd: '22:00'
        }
      ]
    },
    {
      id: 3,
      name: 'Churrascaria Fogo Nobre',
      phone: '(99) 99345-6789',
      address: 'Av. Principal, 500, Nova Cidade',
      active: true,
      imagePerfilLink: 'https://placehold.co/200x200?text=Fogo+Nobre',
      imageBannerLink: 'https://placehold.co/800x400?text=Fogo+Nobre',
      workingDays: [
        {
          id: 13,
          dayOfWeek: DayOfWeek.MONDAY,
          timeStart: '11:00',
          timeEnd: '15:00'
        },
        {
          id: 14,
          dayOfWeek: DayOfWeek.TUESDAY,
          timeStart: '11:00',
          timeEnd: '15:00'
        },
        {
          id: 15,
          dayOfWeek: DayOfWeek.WEDNESDAY,
          timeStart: '11:00',
          timeEnd: '15:00'
        },
        {
          id: 16,
          dayOfWeek: DayOfWeek.THURSDAY,
          timeStart: '11:00',
          timeEnd: '15:00'
        },
        {
          id: 17,
          dayOfWeek: DayOfWeek.FRIDAY,
          timeStart: '11:00',
          timeEnd: '15:00'
        },
        {
          id: 18,
          dayOfWeek: DayOfWeek.SATURDAY,
          timeStart: '11:00',
          timeEnd: '16:00'
        },
        {
          id: 19,
          dayOfWeek: DayOfWeek.SUNDAY,
          timeStart: '11:00',
          timeEnd: '16:00'
        }
      ]
    }
  ],

  reservesToday: [
    {
      id: 101,
      clientName: 'João Silva',
      restaurantName: 'Pizzaria Bella Napoli',
      tableNumber: 4,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '19:00',
      timeEnd: '20:00',
      status: ReserveStatus.CONFIRMED,
      observation: 'Mesa próxima à janela',
      peoples: 4
    },
    {
      id: 102,
      clientName: 'Maria Oliveira',
      restaurantName: 'Sushi House',
      tableNumber: 2,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '19:30',
      timeEnd: '20:30',
      status: ReserveStatus.SCHEDULED,
      observation: 'Comemoração de aniversário',
      peoples: 2
    },
    {
      id: 103,
      clientName: 'Pedro Santos',
      restaurantName: 'Churrascaria Fogo Nobre',
      tableNumber: 8,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '20:00',
      timeEnd: '21:00',
      status: ReserveStatus.COMPLETED,
      observation: '',
      peoples: 6
    },
    {
      id: 104,
      clientName: 'Ana Costa',
      restaurantName: 'Pizzaria Bella Napoli',
      tableNumber: 3,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '20:30',
      timeEnd: '21:30',
      status: ReserveStatus.CANCELED,
      observation: 'Cliente cancelou a reserva',
      peoples: 2
    },
    {
      id: 105,
      clientName: 'Lucas Ferreira',
      restaurantName: 'Sushi House',
      tableNumber: 5,
      date: '2026-10-20',
      dayOfWeek: 'TUESDAY',
      timeStart: '21:00',
      timeEnd: '22:00',
      status: ReserveStatus.NO_SHOW,
      observation: 'Cliente não compareceu',
      peoples: 3
    }
  ]
  };

  ngOnInit(){
    this.userService.getDashboardOfUser().subscribe({
      next:(data) =>{
        this.dashboardUser.set(data)
      }, error: (error:HttpErrorResponse) => {
        const showError = this.exceptionService.handlerRedirectExceptionResponse(error, UtilityService.pathsOfApplication.CLIENT_HOME);
        if (showError) {
          this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error))
        }
      }
    })
  }
}
