import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { MessageError } from '../../../message-error/message-error';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { DishesOfRestauranteResponseDTO } from '../../../../types/dish/dishes-of-restaurant-response';
import { ClientCardDish } from '../client-card-dish/client-card-dish';
import { ClientDishCategory } from '../client-dish-category/client-dish-category';

@Component({
  selector: 'app-client-show-dishes',
  imports: [MessageError, ClientCardDish, ClientDishCategory, RouterLink],
  templateUrl: './client-show-dishes.html',
  styleUrl: './client-show-dishes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientShowDishes {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);
  private readonly destroyRef = inject(DestroyRef);

  readonly dishesOfRestaurant = signal(<DishesOfRestauranteResponseDTO>{});
  readonly restaurantId = signal<number | null>(null);
  readonly loading = signal(true);
  readonly loadFailed = signal(false);



  



  readonly hasDishes = computed(
    () => (this.dishesOfRestaurant()?.categories?.length ?? 0) > 0 ||
          (this.dishesOfRestaurant()?.dishesWithoutCategories?.length ?? 0) > 0
  );

 

  ngOnInit(): void {
    this.utilityService.updateCurrentPageOfOwnerMenu(1)
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = Number(params.get('id'));

        if (Number.isInteger(id) && id > 0) {
          this.restaurantId.set(id);
          this.loadDishes(id);
        }
      });
  }

  loadDishes(id: number) {
    this.restaurantService.getDishesOfRestaurant(id).subscribe({
      next: (response) => {
        this.dishesOfRestaurant.set(response);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.loadFailed.set(true);

        const showError = this.exceptionService.handlerRedirectExceptionResponse(
          error,
          UtilityService.pathsOfApplication.CLIENT_SHOW_DISHES(id),
        );

        if (showError) {
          this.utilityService.handlerShowMenssageErrorSubject(
            ExceptionResponse.fromHttpError(error),
          );
        }
      },
    });
  }
}
