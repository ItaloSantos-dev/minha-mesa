import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { HttpClient } from '@angular/common/http';
import { CreateRateDishRequestDTO } from '../../types/rate_dish/create-rate-dish-request';
import { Observable } from 'rxjs';
import { RateDishResponseDTO } from '../../types/rate_dish/rate-dish-response';

@Injectable({
  providedIn: 'root',
})
export class RateDishService {

  private readonly url = API_BACK_CONFIG.URL;
  private httpClient = inject(HttpClient);

  public createRateDish(data: CreateRateDishRequestDTO): Observable<RateDishResponseDTO> {
    return this.httpClient.post<RateDishResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RATE_DISH.CREATE,
      data,
    );
  }
}
