import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DishResponseDTO } from '../../../../../types/dish/dish-repsonse';

@Component({
  selector: 'app-owner-card-dish',
  imports: [RouterLink],
  templateUrl: './owner-card-dish.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerCardDish {
  readonly dish = input.required<DishResponseDTO>();

  formatPrice(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.dish().price);
  }

  formatRating(): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(this.dish().rating);
  }

  preparationTimeInMinutes(): number {
    return Math.ceil(this.dish().preparationTime / 60);
  }
}
