import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DishCategoryResponseDTO } from '../../../../../types/dish_category/dish-category-response';
import { CreateDishRequestDTO } from '../../../../../types/dish/create-dish-request';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { MessageError } from '../../../../message-error/message-error';

@Component({
  selector: 'app-owner-create-dish',
  imports: [MessageError, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-create-dish.html',
  styleUrl: './owner-create-dish.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerCreateDish {
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);
  private readonly router = inject(Router);

  readonly dishCategories = signal<DishCategoryResponseDTO[]>([]);
  readonly imagePath = signal('');
  readonly imageTouched = signal(false);

  private imageFile: File | null = null;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dishCategory: new FormControl<number | null>(null),
    description: new FormControl('', { nonNullable: true }),
    preparationTime: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
    ]),
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
  });

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(UtilityService.ownerMenuPosition.DISHES);
    this.loadDishCategories();
  }

  loadDishCategories() {
    this.restaurantService.getDishesOfOwnerRestaurant().subscribe({
      next: (data) => {
        this.dishCategories.set(data.categories);
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

  createDishRequest(): CreateDishRequestDTO {
    const dishCategory = this.form.controls.dishCategory.value;
    const description = this.form.controls.description.value;

    return {
      name: this.form.controls.name.value,
      dishCategory,
      description: description.trim() || null,
      preparationTime: this.form.controls.preparationTime.value as number,
      price: this.form.controls.price.value as number,
    };
  }

  generateFormDataCreateDishRequest(): FormData {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(this.createDishRequest())], { type: 'application/json' }),
    );
    formData.append('image', this.imageFile as File);
    return formData;
  }

  handlerShowError(error: HttpErrorResponse) {
    const showError = this.exceptionService.handlerRedirectExceptionResponse(
      error,
      UtilityService.pathsOfApplication.OWNER_SHOW_DISHES,
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

    this.restaurantService.createDish(this.generateFormDataCreateDishRequest()).subscribe({
      next: () => {
        void this.router.navigate([UtilityService.pathsOfApplication.OWNER_SHOW_DISHES]);
      },
      error: (error: HttpErrorResponse) => {
        this.handlerShowError(error);
      },
    });
  }
}
