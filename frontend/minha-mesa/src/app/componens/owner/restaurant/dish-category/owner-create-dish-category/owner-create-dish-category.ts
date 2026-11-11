import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DishResponseDTO } from '../../../../../types/dish/dish-repsonse';
import { CreateDishCategoryRequestDTO } from '../../../../../types/dish_category/create-dish-category-request';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { MessageError } from '../../../../message-error/message-error';

@Component({
  selector: 'app-owner-create-dish-category',
  imports: [MessageError, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-create-dish-category.html',
  styleUrl: './owner-create-dish-category.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerCreateDishCategory {
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);
  private readonly router = inject(Router);

  readonly availableDishes = signal<DishResponseDTO[]>([]);
  readonly selectedDishIds = signal<number[]>([]);
  readonly imagePath = signal('');
  readonly imageTouched = signal(false);

  private imageFile: File | null = null;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(
      UtilityService.ownerMenuPosition.DISH_CATEGORIES,
    );
    this.loadAvailableDishes();
  }

  loadAvailableDishes() {
    this.restaurantService.getDishesOfOwnerRestaurant().subscribe({
      next: (data) => {
        this.availableDishes.set(data.dishesWithoutCategories);
      },
      error: (error: HttpErrorResponse) => {
        this.handlerShowError(error);
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.imageTouched.set(true);

    if (file) {
      this.imageFile = file;
      this.imagePath.set(URL.createObjectURL(file));
    }
  }

  isDishSelected(dishId: number): boolean {
    return this.selectedDishIds().includes(dishId);
  }

  toggleDishSelection(dishId: number) {
    this.selectedDishIds.update((ids) =>
      ids.includes(dishId) ? ids.filter((id) => id !== dishId) : [...ids, dishId],
    );
  }

  createDishCategoryRequest(): CreateDishCategoryRequestDTO {
    return {
      name: this.form.controls.name.value,
      dishIds: this.selectedDishIds().length > 0 ? this.selectedDishIds() : null,
    };
  }

  generateFormDataCreateDishCategoryRequest(): FormData {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(this.createDishCategoryRequest())], {
        type: 'application/json',
      }),
    );
    formData.append('image', this.imageFile as File);
    return formData;
  }

  handlerShowError(error: HttpErrorResponse) {
    const showError = this.exceptionService.handlerRedirectExceptionResponse(
      error,
      UtilityService.pathsOfApplication.OWNER_SHOW_DISH_CATEGORIES,
    );
    if (showError) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
    }
  }

  ngOnSubmit() {
    if (this.form.invalid || !this.imageFile) {
      this.form.markAllAsTouched();
      this.imageTouched.set(true);
      return;
    }

    this.restaurantService
      .createDishCategory(this.generateFormDataCreateDishCategoryRequest())
      .subscribe({
        next: () => {
          void this.router.navigate([
            UtilityService.pathsOfApplication.OWNER_SHOW_DISH_CATEGORIES,
          ]);
        },
        error: (error: HttpErrorResponse) => {
          this.handlerShowError(error);
        },
      });
  }
}
