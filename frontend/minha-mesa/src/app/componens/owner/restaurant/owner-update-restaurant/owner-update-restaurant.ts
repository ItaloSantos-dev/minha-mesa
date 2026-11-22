import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { RestaurantResponseDTO } from '../../../../types/restaurant/restaurant-response';
import { UpdateRestaurantRequestDTO } from '../../../../types/restaurant/update-restaurant-request';
import { MessageError } from '../../../message-error/message-error';

@Component({
  selector: 'app-owner-update-restaurant',
  imports: [MessageError, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-update-restaurant.html',
  styleUrl: './owner-update-restaurant.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerUpdateRestaurant {
  private readonly restaurantService = inject(RestaurantService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly restaurant = signal<RestaurantResponseDTO | null>(null);
  readonly profileImagePath = signal('');
  readonly bannerImagePath = signal('');
  readonly loading = signal(true);
  readonly loadFailed = signal(false);
  readonly saving = signal(false);
  readonly deactivating = signal(false);
  readonly activating = signal(false);
  readonly activationFailed = signal(false);
  readonly successMessage = signal('');
  private profileImageFile: File | null = null;
  private bannerImageFile: File | null = null;

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(11)],
    }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit() {
    this.loadRestaurant();
  }

  loadRestaurant() {
    this.restaurantService.getRestaurantOfOwner().subscribe({
      next: (restaurant) => {
        this.restaurant.set(restaurant);
        this.profileImagePath.set(restaurant.imagePerfilLink);
        this.bannerImagePath.set(restaurant.imageBannerLink);
        this.form.setValue({
          name: restaurant.name,
          phone: restaurant.phone,
          address: restaurant.address,
        });
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.loadFailed.set(true);
        this.handlerShowError(error);
      },
    });
  }

  onFileSelected(event: Event, image: 'profile' | 'banner') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (image === 'profile') {
      this.profileImageFile = file;
      this.profileImagePath.set(URL.createObjectURL(file));
    } else {
      this.bannerImageFile = file;
      this.bannerImagePath.set(URL.createObjectURL(file));
    }
    this.successMessage.set('');
  }

  generateUpdateRestaurantRequest(): UpdateRestaurantRequestDTO {
    const restaurant = this.restaurant();
    const changes: UpdateRestaurantRequestDTO = {};
    if (!restaurant) return changes;

    const name = this.form.controls.name.value.trim();
    const phone = this.form.controls.phone.value.trim();
    const address = this.form.controls.address.value.trim();

    if (name !== restaurant.name) changes.name = name;
    if (phone !== restaurant.phone) changes.phone = phone;
    if (address !== restaurant.address) changes.address = address;
    return changes;
  }

  generateFormDataUpdateRestaurantRequest(): FormData {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(this.generateUpdateRestaurantRequest())], {
        type: 'application/json',
      }),
    );

    if (this.profileImageFile) {
      formData.append('imagePerfil', this.profileImageFile);
    }
    if (this.bannerImageFile) {
      formData.append('imageBanner', this.bannerImageFile);
    }

    return formData;
  }

  handlerShowError(error: HttpErrorResponse) {
    const showError = this.exceptionService.handlerRedirectExceptionResponse(
      error,
      UtilityService.pathsOfApplication.OWNER_UPDATE_RESTAURANT,
    );
    if (showError) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
    }
  }

  ngOnSubmit() {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const changes = this.generateUpdateRestaurantRequest();
    if (Object.keys(changes).length === 0 && !this.profileImageFile && !this.bannerImageFile) {
      return;
    }

    this.saving.set(true);
    this.successMessage.set('');
    this.restaurantService.updateRestaurant(this.generateFormDataUpdateRestaurantRequest()).subscribe({
      next: (restaurant) => {
        this.restaurant.set(restaurant);
        this.profileImagePath.set(restaurant.imagePerfilLink);
        this.bannerImagePath.set(restaurant.imageBannerLink);
        this.profileImageFile = null;
        this.bannerImageFile = null;
        this.saving.set(false);
        this.successMessage.set('Dados do restaurante atualizados com sucesso.');
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);
        this.handlerShowError(error);
      },
    });
  }

  deactivateRestaurant() {
    if (!this.restaurant()?.active || this.deactivating()) return;

    this.deactivating.set(true);
    this.successMessage.set('');
    this.restaurantService.deactivateRestaurant().subscribe({
      next: () => {
        this.restaurant.update((restaurant) => restaurant ? { ...restaurant, active: false } : restaurant);
        this.deactivating.set(false);
        this.successMessage.set('Restaurante desativado. Os dados foram mantidos.');
      },
      error: (error: HttpErrorResponse) => {
        this.deactivating.set(false);
        this.handlerShowError(error);
      },
    });
  }

  activateRestaurant() {
    if (this.restaurant()?.active || this.activating()) return;

    this.activating.set(true);
    this.activationFailed.set(false);
    this.successMessage.set('');
    this.restaurantService.activateRestaurant().subscribe({
      next: (restaurant) => {
        this.restaurant.set(restaurant);
        this.activating.set(false);
        if (restaurant.active) {
          this.successMessage.set('Restaurante ativado com sucesso.');
        } else {
          this.activationFailed.set(true);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.activating.set(false);
        this.handlerShowError(error);
      },
    });
  }
}
