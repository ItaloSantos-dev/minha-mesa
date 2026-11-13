import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { CreateReserveDishRequestDTO } from '../../types/reserve_dish/create-reserve-dish-request';
import { ReserveDishResponseDTO } from '../../types/reserve_dish/reserve-dish-response';
import { UpdateReserveDishRequestDTO } from '../../types/reserve_dish/update-reserve-dish-request';

@Injectable({
  providedIn: 'root',
})
export class ReserveDishService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = API_BACK_CONFIG.URL;

  createReserveDish(data: CreateReserveDishRequestDTO): Observable<ReserveDishResponseDTO> {
    console.log(data);
    return this.httpClient.post<ReserveDishResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESERVE_DISH.CREATE,
      data,
    );
  }

  updateReserveDishById(
    id: number,
    data: UpdateReserveDishRequestDTO,
  ): Observable<ReserveDishResponseDTO> {
    
    
    return this.httpClient.patch<ReserveDishResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESERVE_DISH.UPDATE(id),
      data,
    );
  }
}
