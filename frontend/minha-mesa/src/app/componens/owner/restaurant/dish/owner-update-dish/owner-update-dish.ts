import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DishCategoryResponseDTO } from '../../../../../types/dish_category/dish-category-response';
import { DishResponseDTO } from '../../../../../types/dish/dish-repsonse';
import { UpdateDishRequestDTO } from '../../../../../types/dish/update-dish-request';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { MessageError } from '../../../../message-error/message-error';

@Component({
  selector: 'app-owner-update-dish',
  imports: [MessageError, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-update-dish.html',
  styleUrl: './owner-update-dish.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerUpdateDish {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly dish = signal<DishResponseDTO | null>(null);
  readonly dishCategories = signal<DishCategoryResponseDTO[]>([]);
  readonly imagePath = signal('');
  readonly loading = signal(true);
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
    active: new FormControl(true, { nonNullable: true }),
  });

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(UtilityService.ownerMenuPosition.DISHES);
    this.loadDishCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDish(Number(id));
    }
  }

  loadDish(id: number) {
    this.restaurantService.getDishById(id).subscribe({
      next: (dish) => {
        this.dish.set(dish);
        this.imagePath.set(dish.imageLink);
        this.form.setValue({
          name: dish.name,
          dishCategory: dish.dishCategoryId ?? null,
          description: dish.description ?? '',
          preparationTime: dish.preparationTime,
          price: dish.price,
          active: dish.active,
        });
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.handlerShowError(error);
      },
    });
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

    if (file) {
      this.imageFile = file;
      this.imagePath.set(URL.createObjectURL(file));
    }
  }

  generateUpdateDishRequest(): Partial<UpdateDishRequestDTO> {
    const originalDish = this.dish();
    const changes: Partial<UpdateDishRequestDTO> = {};

    if (!originalDish) {
      return changes;
    }

    const name = this.form.controls.name.value;
    const dishCategory = this.form.controls.dishCategory.value;
    const description = this.form.controls.description.value.trim() || null;
    const preparationTime = this.form.controls.preparationTime.value;
    const price = this.form.controls.price.value;
    const active = this.form.controls.active.value;

    if (name !== originalDish.name) changes.name = name;
    if (dishCategory !== originalDish.dishCategoryId) changes.dishCategory = dishCategory;
    if (description !== originalDish.description) changes.description = description;
    if (preparationTime !== originalDish.preparationTime) changes.preparationTime = preparationTime;
    if (price !== originalDish.price) changes.price = price;
    if (active !== originalDish.active) changes.active = active;

    return changes;
  }

  generateFormDataUpdateDishRequest(changes: Partial<UpdateDishRequestDTO>): FormData {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(changes)], { type: 'application/json' }),
    );

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dish = this.dish();
    if (!dish) {
      return;
    }

    const changes = this.generateUpdateDishRequest();
    if (Object.keys(changes).length === 0 && !this.imageFile) {
      return;
    }

    this.restaurantService
      .updateDishById(dish.id, this.generateFormDataUpdateDishRequest(changes))
      .subscribe({
        next: () => {
          void this.router.navigate([UtilityService.pathsOfApplication.OWNER_SHOW_DISHES]);
        },
        error: (error: HttpErrorResponse) => {
          this.handlerShowError(error);
        },
      });
  }
}
