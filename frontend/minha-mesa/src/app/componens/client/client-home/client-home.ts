import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DashboardUserFactory } from '../../../factory/dashboard-user.factory';
import { ReserveResponseDTO } from '../../../types/reserve/reserve-response';
import { ReserveStatus } from '../../../types/enums/reserve-status';
import { UserService } from '../../../service/user-service/user-service';
import { MessageError } from '../../message-error/message-error';
import { UtilityService } from '../../../service/utility-service/utility-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionService } from '../../../service/exception-service/exception-service';
import { ExceptionResponse } from '../../../types/exception/excpetion-response';
import { DashboardUserResponseDTO } from '../../../types/user/dashboard/dashboard-user-response';
import { ClientRecentRestaurants } from './client-recent-restaurants/client-recent-restaurants';

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

  dashboardUserMock: DashboardUserResponseDTO = DashboardUserFactory.createMock();

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
