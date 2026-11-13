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
  selector: 'app-client-show-dish',
  imports: [MessageError, RouterLink],
  templateUrl: './client-show-dish.html',
  styleUrl: './client-show-dish.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientShowDish {
  private readonly route = inject(ActivatedRoute);
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly dish = signal<DishResponseDTO | null>(null);
  readonly restaurantId = signal<number | null>(null);
  readonly loading = signal(true);
  readonly loadFailed = signal(false);

  ngOnInit() {
    const restaurantId = Number(this.route.snapshot.paramMap.get('restaurantId'));
    const dishId = Number(this.route.snapshot.paramMap.get('dishId'));

    if (
      Number.isInteger(restaurantId) &&
      restaurantId > 0 &&
      Number.isInteger(dishId) &&
      dishId > 0
    ) {
      this.restaurantId.set(restaurantId);
      this.loadDish(dishId, restaurantId);
      return;
    }

    this.loading.set(false);
    this.loadFailed.set(true);
  }

  loadDish(dishId: number, restaurantId: number) {
    this.restaurantService.getDishById(dishId).subscribe({
      next: (dish) => {
        this.dish.set(dish);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.loadFailed.set(true);
        this.handlerShowError(error, restaurantId);
      },
    });
  }

  handlerShowError(error: HttpErrorResponse, restaurantId: number) {
    const showError = this.exceptionService.handlerRedirectExceptionResponse(
      error,
      UtilityService.pathsOfApplication.CLIENT_SHOW_DISHES(restaurantId),
    );

    if (showError) {
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
