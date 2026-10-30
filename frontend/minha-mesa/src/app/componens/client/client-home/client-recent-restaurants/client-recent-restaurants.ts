import { Component, input } from '@angular/core';
import { RestaurantResponseDTO } from '../../../../types/restaurant/restaurant-response';
import { ClientCardRestaurant } from '../../client-card-restaurant/client-card-restaurant';

@Component({
  selector: 'app-client-recent-restaurants',
  imports: [ClientCardRestaurant],
  templateUrl: './client-recent-restaurants.html',
  styleUrl: './client-recent-restaurants.css',
})
export class ClientRecentRestaurants {
  recentrestaurants = input <RestaurantResponseDTO[]>();
}
