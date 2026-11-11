import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DishResponseDTO } from '../../../../../types/dish/dish-repsonse';
import { DishCategoryResponseDTO } from '../../../../../types/dish_category/dish-category-response';
import { UpdateDishCategoryResponseDTO } from '../../../../../types/dish_category/update-dish-category-request';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { MessageError } from '../../../../message-error/message-error';

@Component({
  selector: 'app-owner-update-dish-category',
  imports: [MessageError, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-update-dish-category.html',
  styleUrl: './owner-update-dish-category.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerUpdateDishCategory {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly category = signal<DishCategoryResponseDTO | null>(null);
  readonly availableDishes = signal<DishResponseDTO[]>([]);
  readonly imagePath = signal('');
  readonly loading = signal(true);
  readonly editing = signal(false);
  readonly deactivationRequested = signal(false);
  readonly dishesToAdd = signal<number[]>([]);
  readonly dishesToRemove = signal<number[]>([]);

  private imageFile: File | null = null;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    active: new FormControl(true, { nonNullable: true }),
    removeAllDishsOfCategory: new FormControl<boolean | null>(null),
  });

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(
      UtilityService.ownerMenuPosition.DISH_CATEGORIES,
    );
    this.loadAvailableDishes();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDishCategory(Number(id));
    } else {
      this.loading.set(false);
    }
  }

  loadDishCategory(id: number) {
    this.restaurantService.getDishCategoryById(id).subscribe({
      next: (category) => {
        this.category.set(category);
        this.imagePath.set(category.imageLink);
        this.form.patchValue({
          name: category.name,
          active: category.active,
        });
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.handlerShowError(error);
      },
    });
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

  startEditing() {
    const category = this.category();
    if (!category) {
      return;
    }

    this.form.patchValue({
      name: category.name,
      active: category.active,
      removeAllDishsOfCategory: null,
    });
    this.imagePath.set(category.imageLink);
    this.imageFile = null;
    this.dishesToAdd.set([]);
    this.dishesToRemove.set([]);
    this.deactivationRequested.set(false);
    this.editing.set(true);
  }

  cancelEditing() {
    this.editing.set(false);
    this.deactivationRequested.set(false);
    this.imageFile = null;
    this.dishesToAdd.set([]);
    this.dishesToRemove.set([]);

    const category = this.category();
    if (category) {
      this.imagePath.set(category.imageLink);
      this.form.patchValue({
        name: category.name,
        active: category.active,
        removeAllDishsOfCategory: null,
      });
    }
  }

  onActiveChange() {
    const category = this.category();
    const isDeactivating = !!category?.active && !this.form.controls.active.value;
    this.deactivationRequested.set(isDeactivating);
    this.form.controls.removeAllDishsOfCategory.setValue(null);
    this.dishesToAdd.set([]);
    this.dishesToRemove.set([]);

    if (isDeactivating) {
      this.imageFile = null;
      this.imagePath.set(category.imageLink);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.imageFile = file;
      this.imagePath.set(URL.createObjectURL(file));
    }
  }

  canManageDishes(): boolean {
    return !!this.category()?.active && this.form.controls.active.value;
  }

  isDishMarkedForRemoval(dishId: number): boolean {
    return this.dishesToRemove().includes(dishId);
  }

  isDishMarkedForAddition(dishId: number): boolean {
    return this.dishesToAdd().includes(dishId);
  }

  toggleDishRemoval(dishId: number) {
    this.dishesToRemove.update((ids) =>
      ids.includes(dishId) ? ids.filter((id) => id !== dishId) : [...ids, dishId],
    );
  }

  toggleDishAddition(dishId: number) {
    this.dishesToAdd.update((ids) =>
      ids.includes(dishId) ? ids.filter((id) => id !== dishId) : [...ids, dishId],
    );
  }

  generateUpdateDishCategoryRequest(): Partial<UpdateDishCategoryResponseDTO> {
    const category = this.category();
    if (!category) {
      return {};
    }

    const changes: Partial<UpdateDishCategoryResponseDTO> = {};
    const active = this.form.controls.active.value;
    const statusChanged = active !== category.active;
    const isDeactivating = category.active && !active;

    if (statusChanged) {
      changes.updateActive = true;
    }

    if (isDeactivating) {
      const removeAll = this.form.controls.removeAllDishsOfCategory.value;
      if (removeAll !== null) {
        changes.removeAllDishsOfCategory = removeAll;
      }
      return changes;
    }

    const name = this.form.controls.name.value;
    if (name !== category.name) {
      changes.name = name;
    }

    if (!statusChanged) {
      if (this.dishesToAdd().length > 0) {
        changes.dishesToAdd = this.dishesToAdd();
      }
      if (this.dishesToRemove().length > 0) {
        changes.dishesToRemove = this.dishesToRemove();
      }
    }

    return changes;
  }

  generateFormDataUpdateDishCategoryRequest(
    changes: Partial<UpdateDishCategoryResponseDTO>,
  ): FormData {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(changes)], { type: 'application/json' }));

    if (this.imageFile && !this.deactivationRequested()) {
      formData.append('image', this.imageFile);
    }

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
    const category = this.category();
    if (!category) {
      return;
    }

    if (
      !this.deactivationRequested() &&
      this.form.controls.name.invalid
    ) {
      this.form.controls.name.markAsTouched();
      return;
    }

    if (
      this.deactivationRequested() &&
      this.form.controls.removeAllDishsOfCategory.value === null
    ) {
      return;
    }

    const changes = this.generateUpdateDishCategoryRequest();
    if (Object.keys(changes).length === 0 && !this.imageFile) {
      return;
    }

    this.restaurantService
      .updateDishCategoryById(
        category.id,
        this.generateFormDataUpdateDishCategoryRequest(changes),
      )
      .subscribe({
        next: () => {
          void this.router.navigate([UtilityService.pathsOfApplication.OWNER_SHOW_DISH_CATEGORIES]);
        },
        error: (error: HttpErrorResponse) => {
          this.handlerShowError(error);
        },
      });
  }
}
