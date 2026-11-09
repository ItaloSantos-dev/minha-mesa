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
        { id: 1, dayOfWeek: DayOfWeek.MONDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 2, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 3, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '17:00', timeEnd: '18:00' },
        { id: 4, dayOfWeek: DayOfWeek.THURSDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 5, dayOfWeek: DayOfWeek.FRIDAY, timeStart: '18:00', timeEnd: '00:00' },
        { id: 6, dayOfWeek: DayOfWeek.SATURDAY, timeStart: '18:00', timeEnd: '00:00' }
      ],
      bestRatings: {
        bestDishes: [
          {
            id: 1,
            name: 'Pizza Bella Napoli',
            dishCategoryName: 'Pizzas',
            dishCategoryId: 1,
            restaurantName: 'Pizzaria Bella Napoli',
            restaurantId: 1,
            description: 'Pizza artesanal com molho especial, mussarela e manjericão.',
            preparationTime: 1800,
            rating: 4.9,
            price: 49.90,
            slug: 'pizza-bella-napoli',
            imageLink: 'https://placehold.co/400x300?text=Pizza+Bella+Napoli',
            active: true
          },
          {
            id: 2,
            name: 'Pizza Calabresa',
            dishCategoryName: 'Pizzas',
            dishCategoryId: 1,
            restaurantName: 'Pizzaria Bella Napoli',
            restaurantId: 1,
            description: 'Pizza de calabresa com cebola e mussarela.',
            preparationTime: 1500,
            rating: 4.8,
            price: 42.90,
            slug: 'pizza-calabresa',
            imageLink: 'https://placehold.co/400x300?text=Pizza+Calabresa',
            active: true
          }
        ],
        bestRatesDish: [
          {
            id: 1,
            clientName:'Autor',
            dishId: 1,
            dishName: 'Pizza Bella Napoli',
            reserveId: 101,
            restaurantName: 'Pizzaria Bella Napoli',
            rating: 5,
            comment: 'Massa excelente e ingredientes de ótima qualidade!'
          }
        ]
      }
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
        { id: 7, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '11:00', timeEnd: '14:30' },
        { id: 8, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '11:00', timeEnd: '14:30' },
        { id: 9, dayOfWeek: DayOfWeek.THURSDAY, timeStart: '11:00', timeEnd: '14:30' },
        { id: 10, dayOfWeek: DayOfWeek.FRIDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 11, dayOfWeek: DayOfWeek.SATURDAY, timeStart: '18:00', timeEnd: '23:00' },
        { id: 12, dayOfWeek: DayOfWeek.SUNDAY, timeStart: '18:00', timeEnd: '22:00' }
      ],
      bestRatings: {
        bestDishes: [
          {
            id: 3,
            name: 'Combo Sushi Especial',
            dishCategoryName: 'Combos',
            dishCategoryId: 2,
            restaurantName: 'Sushi House',
            restaurantId: 2,
            description: 'Combo especial com sushis variados e sashimis.',
            preparationTime: 1200,
            rating: 4.9,
            price: 59.90,
            slug: 'combo-sushi-especial',
            imageLink: 'https://placehold.co/400x300?text=Combo+Sushi',
            active: true
          },
          {
            id: 4,
            name: 'Temaki de Salmão',
            dishCategoryName: 'Temakis',
            dishCategoryId: 3,
            restaurantName: 'Sushi House',
            restaurantId: 2,
            description: 'Temaki recheado com salmão fresco e cream cheese.',
            preparationTime: 600,
            rating: 4.7,
            price: 27.90,
            slug: 'temaki-de-salmao',
            imageLink: 'https://placehold.co/400x300?text=Temaki',
            active: true
          }
        ],
        bestRatesDish: [
          {
            id: 2,
            clientName:'Autor',
            dishId: 3,
            dishName: 'Combo Sushi Especial',
            reserveId: 102,
            restaurantName: 'Sushi House',
            rating: 5,
            comment: 'Peças muito frescas e apresentação impecável!'
          }
        ]
      }
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
        { id: 13, dayOfWeek: DayOfWeek.MONDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 14, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 15, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 16, dayOfWeek: DayOfWeek.THURSDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 17, dayOfWeek: DayOfWeek.FRIDAY, timeStart: '11:00', timeEnd: '15:00' },
        { id: 18, dayOfWeek: DayOfWeek.SATURDAY, timeStart: '11:00', timeEnd: '16:00' },
        { id: 19, dayOfWeek: DayOfWeek.SUNDAY, timeStart: '11:00', timeEnd: '16:00' }
      ],
      bestRatings: {
        bestDishes: [
          {
            id: 5,
            name: 'Picanha na Brasa',
            dishCategoryName: 'Carnes',
            dishCategoryId: 4,
            restaurantName: 'Churrascaria Fogo Nobre',
            restaurantId: 3,
            description: 'Picanha grelhada acompanhada de arroz, farofa e vinagrete.',
            preparationTime: 1800,
            rating: 4.9,
            price: 69.90,
            slug: 'picanha-na-brasa',
            imageLink: 'https://placehold.co/400x300?text=Picanha',
            active: true
          },
          {
            id: 6,
            name: 'Costela Assada',
            dishCategoryName: 'Carnes',
            dishCategoryId: 4,
            restaurantName: 'Churrascaria Fogo Nobre',
            restaurantId: 3,
            description: 'Costela assada lentamente até ficar macia e suculenta.',
            preparationTime: 2400,
            rating: 4.8,
            price: 59.90,
            slug: 'costela-assada',
            imageLink: 'https://placehold.co/400x300?text=Costela',
            active: true
          }
        ],
        bestRatesDish: [
          {
            id: 3,
            clientName:'Autor',
            dishId: 5,
            dishName: 'Picanha na Brasa',
            reserveId: 103,
            restaurantName: 'Churrascaria Fogo Nobre',
            rating: 5,
            comment: 'Carne muito saborosa e no ponto perfeito!'
          }
        ]
      }
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
    this.utilityService.updateCurrentPageOfOwnerMenu(0)
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
