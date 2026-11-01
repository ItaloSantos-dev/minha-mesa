import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { UserService } from '../../../../service/user-service/user-service';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { ReserveStatus } from '../../../../types/enums/reserve-status';
import { ReserveResponseDTO } from '../../../../types/reserve/reserve-response';
import { MessageError } from '../../../message-error/message-error';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-client-show-reserves',
  imports: [MessageError],
  templateUrl: './client-show-reserves.html',
  styleUrl: './client-show-reserves.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientShowReserves {
  readonly reserves = signal<ReserveResponseDTO[]>([]);
  readonly actualPage = signal(0);
  readonly haveMoreReserves = signal(false);
  readonly isLoading = signal(false);
  readonly hasLoaded = signal(false);

  private readonly userService = inject(UserService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  ngOnInit(): void {
    this.utilityService.updateCurrentPageOfOwnerMenu(2);
    this.loadReserves(0);
  }

  loadReserves(page: number): void {
    if (page < 0 || this.isLoading()) return;

    this.isLoading.set(true);
    this.userService.getReservesOfUser(page).subscribe({
      next: (reserves) => {
        this.reserves.set(reserves);
        this.actualPage.set(page);
        this.haveMoreReserves.set(reserves.length === PAGE_SIZE);
        this.hasLoaded.set(true);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        const shouldShowError = this.exceptionService.handlerRedirectExceptionResponse(
          error,
          UtilityService.pathsOfApplication.CLIENT_SHOW_RESERVES,
        );
        if (shouldShowError) {
          this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
        }
        this.isLoading.set(false);
        this.hasLoaded.set(true);
      },
    });
  }

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

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  getDayLabel(dayOfWeek: string): string {
    const labels: Record<string, string> = {
      MONDAY: 'Segunda-feira',
      TUESDAY: 'Terça-feira',
      WEDNESDAY: 'Quarta-feira',
      THURSDAY: 'Quinta-feira',
      FRIDAY: 'Sexta-feira',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo',
    };
    return labels[dayOfWeek] ?? dayOfWeek;
  }
}
