import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { DishesOfRestauranteResponseDTO } from '../../../../../types/dish/dishes-of-restaurant-response';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { MessageError } from '../../../../message-error/message-error';
import { OwnerDishCategoryCard } from '../owner-dish-category-card/owner-dish-category-card';

@Component({
  selector: 'app-owner-show-dish-cateogries',
  imports: [MessageError, OwnerDishCategoryCard],
  templateUrl: './owner-show-dish-cateogries.html',
  styleUrl: './owner-show-dish-cateogries.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowDishCateogries {
  private readonly utilityService = inject(UtilityService);
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);

  readonly dishesOfRestaurant = signal<DishesOfRestauranteResponseDTO>({
    categories: [],
    dishesWithoutCategories: [],
  });
  readonly hasCategories = computed(() => this.dishesOfRestaurant().categories.length > 0);

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(UtilityService.ownerMenuPosition.DISH_CATEGORIES);
    this.loadCategories();
  }

  loadCategories() {
    this.restaurantService.getDishesOfOwnerRestaurant().subscribe({
      next: (data) => {
        this.dishesOfRestaurant.set(data);
      },
      error: (error: HttpErrorResponse) => {
        if (
          this.exceptionService.handlerRedirectExceptionResponse(
            error,
            UtilityService.pathsOfApplication.OWNER_SHOW_DISH_CATEGORIES,
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
