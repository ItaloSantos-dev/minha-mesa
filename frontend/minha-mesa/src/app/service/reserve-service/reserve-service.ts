import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReserveStatus } from '../../types/enums/reserve-status';
import { ReserveUpdatedResponseDTO } from '../../types/reserve/reserve-updated-response';

@Injectable({
  providedIn: 'root',
})
export class ReserveService {
  private readonly url = API_BACK_CONFIG.URL;
  private httpClient = inject(HttpClient);

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
