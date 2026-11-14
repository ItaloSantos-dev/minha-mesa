import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { DishResponseDTO } from '../../types/dish/dish-repsonse';
import { DishesOfRestauranteResponseDTO } from '../../types/dish/dishes-of-restaurant-response';
import { RateDishResponseDTO } from '../../types/rate_dish/rate-dish-response';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  private readonly url = API_BACK_CONFIG.URL;
  private readonly httpClient = inject(HttpClient);

  private generatePageable(page: number, size = 10) {
    return `?page=${page}&size=${size}`;
  }

  getDishesOfRestaurant(id: number): Observable<DishesOfRestauranteResponseDTO> {
    return this.httpClient.get<DishesOfRestauranteResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.DISHES(id),
    );
  }

  getDishesOfOwnerRestaurant(): Observable<DishesOfRestauranteResponseDTO> {
    return this.httpClient.get<DishesOfRestauranteResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.OWNER_DISHES,
    );
  }

  createDish(data: FormData): Observable<DishResponseDTO> {
    return this.httpClient.post<DishResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH.CREATE,
      data,
    );
  }

  getDishById(id: number): Observable<DishResponseDTO> {
    return this.httpClient.get<DishResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH.FIND(id),
    );
  }

  getRatesOfDish(id: number, page: number, size: number): Observable<RateDishResponseDTO[]> {
    return this.httpClient.get<RateDishResponseDTO[]>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH.RATES(id) + this.generatePageable(page, size),
    );
  }

  updateDishById(id: number, data: FormData): Observable<DishResponseDTO> {
    return this.httpClient.patch<DishResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH.UPDATE(id),
      data,
    );
  }
}
