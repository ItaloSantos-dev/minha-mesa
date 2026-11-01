import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { Observable } from 'rxjs';
import { ReserveResponseDTO } from '../../types/reserve/reserve-response';
import { ReserveStatus } from '../../types/enums/reserve-status';
import { DashboardResponseDTO } from '../../types/restaurant/dashboard/dashboard-response';
import { DashboardUserResponseDTO } from '../../types/user/dashboard/dashboard-user-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = API_BACK_CONFIG.URL;

  

  public getDashboardOfUser():Observable<DashboardUserResponseDTO>{
    return this.httpClient.get<DashboardUserResponseDTO>( this.url+ API_BACK_CONFIG.ENDPOINTS.USER.DASHBOARD);
  }

  public getReservesOfUser(page: number): Observable<ReserveResponseDTO[]> {
    return this.httpClient.get<ReserveResponseDTO[]>(
      `${this.url}${API_BACK_CONFIG.ENDPOINTS.USER.RESERVES}?page=${page}&size=10`,
    );
  }
}
