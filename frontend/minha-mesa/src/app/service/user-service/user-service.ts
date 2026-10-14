import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { Observable } from 'rxjs';
import { ReserveResponseDTO } from '../../types/reserve/reserve-response';
import { ReserveStatus } from '../../types/enums/reserve-status';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = API_BACK_CONFIG.URL;

  

  public getReservesTodayOfUser():Observable<ReserveResponseDTO[]>{
    console.log(this.url+ API_BACK_CONFIG.ENDPOINTS.USER.RESERVES_TODAY);
    
    return this.httpClient.get<ReserveResponseDTO[]>( this.url+ API_BACK_CONFIG.ENDPOINTS.USER.RESERVES_TODAY);
  }
}
