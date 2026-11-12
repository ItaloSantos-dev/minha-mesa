import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { RateDishResponseDTO } from '../../../../../types/rate_dish/rate-dish-response';
import { MessageError } from '../../../../message-error/message-error';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-owner-show-rates-dish',
  imports: [MessageError, RouterLink],
  templateUrl: './owner-show-rates-dish.html',
  styleUrl: './owner-show-rates-dish.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowRatesDish {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly dishId = Number(this.route.snapshot.paramMap.get('id'));

  readonly rates = signal<RateDishResponseDTO[]>([]);
  readonly actualPage = signal(0);
  readonly haveMoreRates = signal(false);
  readonly isLoading = signal(false);

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(UtilityService.ownerMenuPosition.DISHES);
    this.loadParameters();
  }

  loadParameters() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const page = Number(params.get('page') ?? 0);
      this.actualPage.set(page);
      this.loadRates(page);
    });
  }

  loadRates(page: number) {
    this.isLoading.set(true);
    this.restaurantService.getRatesOfDish(this.dishId, page, PAGE_SIZE).subscribe({
      next: (rates) => {
        this.rates.set(rates);
        this.haveMoreRates.set(rates.length === PAGE_SIZE);
        this.isLoading.set(false);
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
        this.isLoading.set(false);
      },
    });
  }

  updatePage(page: number) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page || 0 },
      queryParamsHandling: 'merge',
    });
  }
}
