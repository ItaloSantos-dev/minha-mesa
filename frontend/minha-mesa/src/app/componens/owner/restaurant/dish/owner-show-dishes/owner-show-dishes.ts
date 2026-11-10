import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { DishesOfRestauranteResponseDTO } from '../../../../../types/dish/dishes-of-restaurant-response';
import { MessageError } from '../../../../message-error/message-error';
import { OwnerCardDish } from '../owner-card-dish/owner-card-dish';

@Component({
  selector: 'app-owner-show-dishes',
  imports: [MessageError, OwnerCardDish, RouterLink],
  templateUrl: './owner-show-dishes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowDishes {
  private readonly utilityService = inject(UtilityService);
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);

  readonly dishesOfRestaurant = signal(<DishesOfRestauranteResponseDTO>{});

  readonly hasDishes = computed(
    () =>
      this.dishesOfRestaurant().categories.length > 0 ||
      this.dishesOfRestaurant().dishesWithoutCategories.length > 0,
  );

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(UtilityService.ownerMenuPosition.DISHES);
    this.loadDishes();
  }

  loadDishes() {
    this.restaurantService.getDishesOfOwnerRestaurant().subscribe({
      next: (data) => {
        this.dishesOfRestaurant.set(data);
      },
      error: (error: HttpErrorResponse) => {
        if (
          this.exceptionService.handlerRedirectExceptionResponse(
            error,
            UtilityService.pathsOfApplication.OWNER_SHOW_DISHES,
          )
        ) {
          this.utilityService.handlerShowMenssageErrorSubject(
            ExceptionResponse.fromHttpError(error),
          );
        }
      },
    });
  }
}
