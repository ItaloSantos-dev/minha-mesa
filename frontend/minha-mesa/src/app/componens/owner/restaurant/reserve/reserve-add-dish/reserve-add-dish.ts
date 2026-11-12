import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { DishResponseDTO } from '../../../../../types/dish/dish-repsonse';

@Component({
  selector: 'app-reserve-add-dish',
  templateUrl: './reserve-add-dish.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReserveAddDish {
  readonly dishes = input.required<DishResponseDTO[]>();
  readonly isSubmitting = input(false);
  readonly closed = output<void>();
  readonly dishAdded = output<{ dishId: number; quantity: number }>();
  readonly selectedDishId = signal<number | null>(null);
  readonly quantity = signal(1);

  selectDish(dishId: number) {
    if (!this.isSubmitting()) {
      this.selectedDishId.set(dishId);
    }
  }

  onQuantityChanged(event: Event) {
    this.quantity.set(Number((event.target as HTMLInputElement).value));
  }

  isValidQuantity(): boolean {
    return Number.isInteger(this.quantity()) && this.quantity() > 0;
  }

  submit(event: SubmitEvent) {
    event.preventDefault();
    const dishId = this.selectedDishId();
    const quantity = this.quantity();

    if (!dishId || !this.isValidQuantity() || this.isSubmitting()) {
      return;
    }

    this.dishAdded.emit({ dishId, quantity });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }
}
