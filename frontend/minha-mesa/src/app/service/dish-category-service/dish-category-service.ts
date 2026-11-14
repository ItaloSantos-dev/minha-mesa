import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { DishCategoryResponseDTO } from '../../types/dish_category/dish-category-response';

@Injectable({
  providedIn: 'root',
})
export class DishCategoryService {
  private readonly url = API_BACK_CONFIG.URL;
  private readonly httpClient = inject(HttpClient);

  createDishCategory(data: FormData): Observable<DishCategoryResponseDTO> {
    return this.httpClient.post<DishCategoryResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH_CATEGORY.CREATE,
      data,
    );
  }

  getDishCategoryById(id: number): Observable<DishCategoryResponseDTO> {
    return this.httpClient.get<DishCategoryResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH_CATEGORY.FIND(id),
    );
  }

  updateDishCategoryById(
    id: number,
    data: FormData,
  ): Observable<DishCategoryResponseDTO> {
    return this.httpClient.patch<DishCategoryResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH_CATEGORY.UPDATE(id),
      data,
    );
  }
}
