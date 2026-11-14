import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { DishService } from '../../../../../service/dish-service/dish-service';
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
  private readonly dishService = inject(DishService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly dish = signal<DishResponseDTO | null>(null);
  readonly restaurantSlug = signal<string | null>(null);
  readonly loading = signal(true);
  readonly loadFailed = signal(false);

  ngOnInit() {
    const restaurantSlug = this.route.snapshot.paramMap.get('restaurantSlug');
    const dishSlug = this.route.snapshot.paramMap.get('dishSlug');

    if (
      restaurantSlug && dishSlug
    ) {
      this.restaurantSlug.set(restaurantSlug);
      this.loadDish(restaurantSlug, dishSlug);
      return;
    }

    this.loading.set(false);
    this.loadFailed.set(true);
  }

  loadDish(restaurantSlug:string, dishSlug:string) {
    this.dishService.getDishOfRestaurantByRestaurantSlugAndDishSlug(restaurantSlug, dishSlug).subscribe({
      next: (dish) => {
        this.dish.set(dish);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.loadFailed.set(true);
        this.handlerShowError(error, restaurantSlug);
      },
    });
  }

  handlerShowError(error: HttpErrorResponse, restaurantSlug:string) {
    const showError = this.exceptionService.handlerRedirectExceptionResponse(
      error,
      UtilityService.pathsOfApplication.CLIENT_SHOW_DISHES(restaurantSlug),
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
