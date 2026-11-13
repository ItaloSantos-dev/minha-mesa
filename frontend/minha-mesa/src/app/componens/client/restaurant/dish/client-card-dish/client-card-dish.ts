import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DishResponseDTO } from '../../../../../types/dish/dish-repsonse';

@Component({
  selector: 'app-client-card-dish',
  imports: [RouterLink],
  templateUrl: './client-card-dish.html',
  styleUrl: './client-card-dish.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCardDish {
  readonly dish = input.required<DishResponseDTO>();

  preparationTimeInMinutes(): number {
    return Math.ceil(this.dish().preparationTime / 60);
  }

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
}
