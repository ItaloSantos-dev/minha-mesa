import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReserveResponseDTO } from '../../../types/reserve/reserve-response';
import { ReserveStatus } from '../../../types/enums/reserve-status';
import { UserService } from '../../../service/user-service/user-service';
import { MessageError } from '../../message-error/message-error';
import { UtilityService } from '../../../service/utility-service/utility-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionService } from '../../../service/exception-service/exception-service';
import { ExceptionResponse } from '../../../types/exception/excpetion-response';

@Component({
  selector: 'app-client-home',
  imports: [MessageError],
  templateUrl: './client-home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientHome {
  readonly reserves = signal<ReserveResponseDTO[]>([]);

  private readonly userService = inject(UserService);

  private readonly utilityService = inject(UtilityService);

  private readonly exceptionService = inject(ExceptionService);

  readonly reservesMock:ReserveResponseDTO[] = [
    {
        id: 1,
        clientName: "Carice freire",
        restaurantName: "Restaurante molho aberto",
        tableNumber: 1,
        date: "2026-10-14",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "",
        peoples: 2
    },
    {
        id: 2,
        clientName: "Carice freire",
        restaurantName: "Restaurante molho sem fechado",
        tableNumber: 1,
        date: "2026-10-15",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 3,
        clientName: "italo",
        restaurantName: "Restaurante molho semiaberto",
        tableNumber: 1,
        date: "2026-10-16",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 4,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-16",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 5,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-23",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 6,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-30",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 7,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-06",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 8,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-13",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 9,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-20",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 9,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-20",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    }
  ];

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
    this.reserves().reduce((total, reserve) => total + reserve.peoples, 0),
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

  ngOnInit(){
    this.reserves.set(this.reservesMock)
    this.userService.getReservesTodayOfUser().subscribe({
      next:(data) =>{
        this.reserves.set(data)
      }, error: (error:HttpErrorResponse) => {
        const showError = this.exceptionService.handlerRedirectExceptionResponse(error, UtilityService.pathsOfApplication.CLIENT_HOME);
        if (showError) {
          this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error))
        }
      }
    })
  }
}
