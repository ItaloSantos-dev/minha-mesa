import { Component, input } from '@angular/core';
import { RestaurantResponseDTO } from '../../../../types/restaurant/restaurant-response';
import { CardRecentRestaurant } from './card-recent-restaurant/card-recent-restaurant';

@Component({
  selector: 'app-client-recent-restaurants',
  imports: [CardRecentRestaurant],
  templateUrl: './client-recent-restaurants.html',
  styleUrl: './client-recent-restaurants.css',
})
export class ClientRecentRestaurants {
  recentrestaurants = input <RestaurantResponseDTO[]>();
}
