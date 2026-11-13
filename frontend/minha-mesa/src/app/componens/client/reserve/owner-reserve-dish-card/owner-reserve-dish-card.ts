import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { DishResponseDTO } from '../../../../types/dish/dish-repsonse';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { ReserveDishStatus } from '../../../../types/enums/reserve-dish-status';
import { ReserveDishResponseDTO } from '../../../../types/reserve_dish/reserve-dish-response';

@Component({
  selector: 'app-owner-reserve-dish-card',
  templateUrl: './owner-reserve-dish-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerReserveDishCard {
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly reserveDish = input.required<ReserveDishResponseDTO>();
  readonly canRate = input(false);
  readonly rateRequested = output<ReserveDishResponseDTO>();
  readonly dish = signal<DishResponseDTO | null>(null);
  readonly dishIsInactive = signal(false);

  ngOnInit() {
    this.restaurantService.getDishById(this.reserveDish().dishId).subscribe({
      next: (dish) => this.dish.set(dish),
      error: (error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.dishIsInactive.set(true);
          return;
        }
        this.handlerShowError(error);
      },
    });
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
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  handlerShowError(error: HttpErrorResponse) {
    if (
      this.exceptionService.handlerRedirectExceptionResponse(
        error,
        UtilityService.pathsOfApplication.CLIENT_SHOW_RESERVES,
      )
    ) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
    }
  }
}
