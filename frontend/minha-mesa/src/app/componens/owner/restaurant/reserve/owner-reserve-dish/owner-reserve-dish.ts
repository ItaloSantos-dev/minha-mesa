import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { ReserveDishService } from '../../../../../service/reserve-dish-service/reserve-dish-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { DishResponseDTO } from '../../../../../types/dish/dish-repsonse';
import { ReserveDishStatus } from '../../../../../types/enums/reserve-dish-status';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { ReserveDishResponseDTO } from '../../../../../types/reserve_dish/reserve-dish-response';
import { UpdateReserveDishRequestDTO } from '../../../../../types/reserve_dish/update-reserve-dish-request';

type ReserveDishUpdateAction = 'add' | 'complete' | 'cancel';

@Component({
  selector: 'app-owner-reserve-dish',
  templateUrl: './owner-reserve-dish.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerReserveDish {
  private readonly restaurantService = inject(RestaurantService);
  private readonly reserveDishService = inject(ReserveDishService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly reserveDish = input.required<ReserveDishResponseDTO>();
  readonly canManage = input(false);
  readonly reserveDishUpdated = output<ReserveDishResponseDTO>();
  readonly dish = signal<DishResponseDTO | null>(null);
  readonly action = signal<ReserveDishUpdateAction | null>(null);
  readonly quantity = signal(1);
  readonly isSaving = signal(false);
  readonly dishStatus = ReserveDishStatus;

  ngOnInit() {
    this.restaurantService.getDishById(this.reserveDish().dishId).subscribe({
      next: (dish) => this.dish.set(dish),
      error: (error: HttpErrorResponse) => {
        if (error.status !== 403) {
          this.handlerShowError(error);
        }
      },
    });
  }

  openUpdate(action: ReserveDishUpdateAction) {
    if (
      !this.canManage() ||
      ((action === 'complete' || action === 'cancel') &&
        this.reserveDish().quantityPending < 1) ||
      (action === 'cancel' && this.reserveDish().status !== ReserveDishStatus.PENDING)
    ) {
      return;
    }
    this.quantity.set(1);
    this.action.set(action);
  }

  closeUpdate() {
    if (!this.isSaving()) {
      this.action.set(null);
    }
  }

  onQuantityChanged(event: Event) {
    this.quantity.set(Number((event.target as HTMLInputElement).value));
  }

  isValidQuantity(value: number): boolean {
    return Number.isInteger(value) && value > 0;
  }

  saveUpdate(event: SubmitEvent) {
    event.preventDefault();
    const action = this.action();
    const quantity = this.quantity();
    const reserveDish = this.reserveDish();

    if (
      !action ||
      !this.canManage() ||
      !this.isValidQuantity(quantity) ||
      this.isSaving() ||
      ((action === 'complete' || action === 'cancel') &&
        quantity > reserveDish.quantityPending) ||
      (action === 'cancel' && reserveDish.status !== ReserveDishStatus.PENDING)
    ) {
      return;
    }

    const request: UpdateReserveDishRequestDTO = {
      addQuantity: action === 'add' ? quantity : null,
      addCompletedQuantity: action === 'complete' ? quantity : null,
      addCanceledQuantity: action === 'cancel' ? quantity : null,
    };

    this.isSaving.set(true);
    this.reserveDishService.updateReserveDishById(reserveDish.id, request).subscribe({
      next: (updatedDish) => {
        this.reserveDishUpdated.emit(updatedDish);
        this.action.set(null);
        this.isSaving.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.handlerShowError(error);
        this.isSaving.set(false);
      },
    });
  }

  actionLabel(action: ReserveDishUpdateAction): string {
    const labels: Record<ReserveDishUpdateAction, string> = {
      add: 'Adicionar unidades',
      complete: 'Concluir unidades',
      cancel: 'Cancelar unidades',
    };
    return labels[action];
  }

  getStatusLabel(status: ReserveDishStatus): string {
    const labels: Record<ReserveDishStatus, string> = {
      [ReserveDishStatus.PENDING]: 'Pendente',
      [ReserveDishStatus.COMPLETED]: 'Concluído',
      [ReserveDishStatus.CANCELED]: 'Cancelado',
    };
    return labels[status];
  }

  getStatusClass(status: ReserveDishStatus): string {
    const classes: Record<ReserveDishStatus, string> = {
      [ReserveDishStatus.PENDING]: 'bg-[#fff2c9] text-[#876200]',
      [ReserveDishStatus.COMPLETED]: 'bg-[#e1f3e8] text-[#28734a]',
      [ReserveDishStatus.CANCELED]: 'bg-[#fde5e2] text-[#a23b31]',
    };
    return classes[status];
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

  handlerShowError(error: HttpErrorResponse) {
    if (
      this.exceptionService.handlerRedirectExceptionResponse(
        error,
        UtilityService.pathsOfApplication.OWNER_SHOW_RESERVES,
      )
    ) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
    }
  }
}
