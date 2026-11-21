import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { UserForOwnerResponseDTO } from '../../../../../types/user/user-for-owner-response';
import { MessageError } from '../../../../message-error/message-error';

@Component({
  selector: 'app-owner-show-clients',
  imports: [MessageError],
  templateUrl: './owner-show-clients.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowClients {
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly clients = signal<UserForOwnerResponseDTO[]>([]);
  readonly searchTerm = signal('');
  readonly isLoading = signal(true);

  readonly filteredClients = computed(() => {
    const search = this.searchTerm().trim().toLocaleLowerCase();
    return this.clients().filter((client) =>
      !search ||
      client.name.toLocaleLowerCase().includes(search) ||
      client.phone.includes(search),
    );
  });

  readonly totalReservations = computed(() =>
    this.clients().reduce((total, client) => total + client.reserveQuantity, 0),
  );

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  private handlerShowError(error: HttpErrorResponse): void {
    if (this.exceptionService.handlerRedirectExceptionResponse(
      error,
      UtilityService.pathsOfApplication.OWNER_SHOW_CLIENTS,
    )) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
    }
  }

  loadClients(): void {
    this.isLoading.set(true);
    this.restaurantService.getClientsOfRestaurant().subscribe({
      next: (clients) => {
        this.clients.set(clients);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.handlerShowError(error);
      },
    });
  }

  ngOnInit(): void {
    this.utilityService.updateCurrentPageOfOwnerMenu(UtilityService.ownerMenuPosition.CLIENTS);
    this.loadClients();
  }
}
