import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { DishResponseDTO } from '../../../../../types/dish/dish-repsonse';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { MessageError } from '../../../../message-error/message-error';

@Component({
  selector: 'app-owner-show-dish',
  imports: [MessageError, RouterLink],
  templateUrl: './owner-show-dish.html',
  styleUrl: './owner-show-dish.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowDish {
  private readonly route = inject(ActivatedRoute);
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly dish = signal<DishResponseDTO | null>(null);
  readonly loading = signal(true);

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(UtilityService.ownerMenuPosition.DISHES);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDish(Number(id));
    }
  }

  loadDish(id: number) {
    this.restaurantService.getDishById(id).subscribe({
      next: (dish) => {
        this.dish.set(dish);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.handlerShowError(error);
      },
    });
  }

  handlerShowError(error: HttpErrorResponse) {
    if (
      this.exceptionService.handlerRedirectExceptionResponse(
        error,
        UtilityService.pathsOfApplication.OWNER_SHOW_DISHES,
      )
    ) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  formatRating(rating: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(rating);
  }

  preparationTimeInMinutes(preparationTime: number): number {
    return Math.ceil(preparationTime / 60);
  }
}
