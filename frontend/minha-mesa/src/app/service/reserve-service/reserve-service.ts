import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReserveStatus } from '../../types/enums/reserve-status';
import { ReserveUpdatedResponseDTO } from '../../types/reserve/reserve-updated-response';
import { CreateReserveRequestDTO } from '../../types/reserve/create-reserve-request';
import { ReserveResponseDTO } from '../../types/reserve/reserve-response';

@Injectable({
  providedIn: 'root',
})
export class ReserveService {
  private readonly url = API_BACK_CONFIG.URL;
  private httpClient = inject(HttpClient);

  createReserve(data: CreateReserveRequestDTO): Observable<ReserveResponseDTO> {
    return this.httpClient.post<ReserveResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESERVE.CREATE,
      data,
    );
  }

  updatStatusOfReserveById(id:number, status:ReserveStatus):Observable<ReserveUpdatedResponseDTO>{
    console.log(this.url + API_BACK_CONFIG.ENDPOINTS.RESERVE + '/' + id);
    
    return this.httpClient.patch<ReserveUpdatedResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESERVE.UPDATE + '/' + id,
      JSON.stringify(status), {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
