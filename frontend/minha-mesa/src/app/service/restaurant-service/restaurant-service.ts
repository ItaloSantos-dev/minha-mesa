import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { CreateRestaurantRequestDTO } from '../../types/restaurant/create-restaurant-request';
import { Observable } from 'rxjs';
import { RestaurantResponseDTO } from '../../types/restaurant/restaurant-response';
import { HttpClient } from '@angular/common/http';
import { DashboardResponseDTO } from '../../types/restaurant/dashboard/dashboard-response';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private readonly url = API_BACK_CONFIG.URL;
  private httpClient = inject(HttpClient); 
  

  createRestaurant(data:CreateRestaurantRequestDTO):Observable<RestaurantResponseDTO>{
    return this.httpClient.post<RestaurantResponseDTO>(
      API_BACK_CONFIG.URL + 
      API_BACK_CONFIG.ENDPOINTS.RESTAURANT.CREATE,
      data
    );
  }


  getDashboard():Observable<DashboardResponseDTO>{
    console.log(this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.DASHBOARD);
    
    return this.httpClient.get<DashboardResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.DASHBOARD
    )
  }
}
