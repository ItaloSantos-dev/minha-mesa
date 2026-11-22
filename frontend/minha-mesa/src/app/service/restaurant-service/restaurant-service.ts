import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { CreateRestaurantRequestDTO } from '../../types/restaurant/create-restaurant-request';
import { catchError, concatMap, Observable, of, throwError } from 'rxjs';
import { RestaurantResponseDTO } from '../../types/restaurant/restaurant-response';
import { DashboardResponseDTO } from '../../types/restaurant/dashboard/dashboard-response';
import { ReserveResponseDTO } from '../../types/reserve/reserve-response';
import { TableResponseDTO } from '../../types/table/table-response';
import { WorkingScheduleResponseDTO } from '../../types/working_schedule/working-schedule-response';
import { ScheduleExceptionResponseDTO } from '../../types/schedule_exception/schedule-exception-response';
import { UserForOwnerResponseDTO } from '../../types/user/user-for-owner-response';
import { UpdateRestaurantRequestDTO } from '../../types/restaurant/update-restaurant-request';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private readonly url = API_BACK_CONFIG.URL;
  private httpClient = inject(HttpClient); 

  private generatePageable(page:number, size = 10){
    return `?page=${page}&size=${size}`
  }
  

  createRestaurant(data:FormData):Observable<RestaurantResponseDTO>{
    return this.httpClient.post<RestaurantResponseDTO>(
      API_BACK_CONFIG.URL + 
      API_BACK_CONFIG.ENDPOINTS.RESTAURANT.CREATE,
      data
    );
  }

  getRestaurantOfOwner():Observable<RestaurantResponseDTO>{
    return this.httpClient.get<RestaurantResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.ME
    );
  }

  updateRestaurant(data:FormData):Observable<RestaurantResponseDTO>{
    return this.httpClient.patch<RestaurantResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.UPDATE,
      data
    );
  }

  activateRestaurant():Observable<RestaurantResponseDTO>{
    const formData = new FormData();
    const activateRequest: UpdateRestaurantRequestDTO = { updateActive: true };
    formData.append(
      'data',
      new Blob([JSON.stringify(activateRequest)], { type: 'application/json' }),
    );

    return this.updateRestaurant(formData);
  }

  deactivateRestaurant():Observable<RestaurantResponseDTO>{
    const formData = new FormData();
    const deactivateRequest: Partial<UpdateRestaurantRequestDTO> = { updateActive: true };
    formData.append(
      'data',
      new Blob([JSON.stringify(deactivateRequest)], { type: 'application/json' }),
    );

    return this.httpClient.delete<void>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.DEACTIVATE
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) return of(undefined);
        return throwError(() => error);
      }),
      // The backend disables related resources in the update path after the restaurant is inactive.
      concatMap(() => this.updateRestaurant(formData))
    );
  }


  getDashboard():Observable<DashboardResponseDTO>{
    console.log(this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.DASHBOARD);
    
    return this.httpClient.get<DashboardResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.DASHBOARD
    )
  }
  

  getReservesOfRestaurant(page:number):Observable<ReserveResponseDTO[]>{
    
    return this.httpClient.get<ReserveResponseDTO[]>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.RESERVES + this.generatePageable(page)
    )
  }

  getClientsOfRestaurant():Observable<UserForOwnerResponseDTO[]>{
    return this.httpClient.get<UserForOwnerResponseDTO[]>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.CLIENTS
    )
  }

  getReserveOfRestaurantById(id:number):Observable<ReserveResponseDTO>{
   
    return this.httpClient.get<ReserveResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.RESERVES + '/' + id
    )
  }

  getTablesOfRestaurant():Observable<TableResponseDTO[]>{
    
    
    return this.httpClient.get<TableResponseDTO[]>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.TABLES
    )
  }

  getWorkingSchedulesOfRestaurant(page:number):Observable<WorkingScheduleResponseDTO[]>{
    
    return this.httpClient.get<WorkingScheduleResponseDTO[]>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.WORKING_SCHEDULES + this.generatePageable(page)
    )
  }

  getScheduleExceptionsOfRestaurant(page:number):Observable<ScheduleExceptionResponseDTO[]>{
    return this.httpClient.get<ScheduleExceptionResponseDTO[]>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.SCHEDULE_EXCEPTIONS + this.generatePageable(page)
    )  
  }

  getRestaurantsLikeName(search:string, page:number):Observable<RestaurantResponseDTO[]>{
    return this.httpClient.get<RestaurantResponseDTO[]>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.SEARCH(search, page)
    )
  }

  getRestaurantbySlug(slug:string):Observable<RestaurantResponseDTO>{
    return this.httpClient.get<RestaurantResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.FINDBYSLUG(slug)
    )
  }

}
