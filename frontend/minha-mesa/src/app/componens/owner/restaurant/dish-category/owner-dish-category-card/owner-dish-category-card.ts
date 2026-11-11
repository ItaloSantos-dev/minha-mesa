import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DishCategoryResponseDTO } from '../../../../../types/dish_category/dish-category-response';

@Component({
  selector: 'app-owner-dish-category-card',
  imports: [RouterLink],
  templateUrl: './owner-dish-category-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerDishCategoryCard {
  readonly category = input.required<DishCategoryResponseDTO>();
}
