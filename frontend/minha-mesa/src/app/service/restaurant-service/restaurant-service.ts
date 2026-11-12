import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { CreateRestaurantRequestDTO } from '../../types/restaurant/create-restaurant-request';
import { Observable } from 'rxjs';
import { RestaurantResponseDTO } from '../../types/restaurant/restaurant-response';
import { HttpClient } from '@angular/common/http';
import { DashboardResponseDTO } from '../../types/restaurant/dashboard/dashboard-response';
import { ReserveResponseDTO } from '../../types/reserve/reserve-response';
import { TableResponseDTO } from '../../types/table/table-response';
import { WorkingScheduleResponseDTO } from '../../types/working_schedule/working-schedule-response';
import { ScheduleExceptionResponseDTO } from '../../types/schedule_exception/schedule-exception-response';
import { DishesOfRestauranteResponseDTO } from '../../types/dish/dishes-of-restaurant-response';
import { DishResponseDTO } from '../../types/dish/dish-repsonse';
import { DishCategoryResponseDTO } from '../../types/dish_category/dish-category-response';
import { RateDishResponseDTO } from '../../types/rate_dish/rate-dish-response';

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

  getRestaurantbyId(id:number):Observable<RestaurantResponseDTO>{
    return this.httpClient.get<RestaurantResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.FIND(id)
    )
  }

  getDishesOfRestaurant(id:number):Observable<DishesOfRestauranteResponseDTO>{
    return this.httpClient.get<DishesOfRestauranteResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.DISHES(id)
    )
  }

  getDishesOfOwnerRestaurant():Observable<DishesOfRestauranteResponseDTO>{
    return this.httpClient.get<DishesOfRestauranteResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.RESTAURANT.OWNER_DISHES
    )
  }

  createDish(data:FormData):Observable<DishResponseDTO>{
    return this.httpClient.post<DishResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH.CREATE,
      data
    )
  }

  getDishById(id:number):Observable<DishResponseDTO>{
    return this.httpClient.get<DishResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH.FIND(id)
    )
  }

  getRatesOfDish(id:number, page:number, size:number):Observable<RateDishResponseDTO[]>{
    return this.httpClient.get<RateDishResponseDTO[]>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH.RATES(id) + this.generatePageable(page, size)
    )
  }

  updateDishById(id:number, data:FormData):Observable<DishResponseDTO>{
    return this.httpClient.patch<DishResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH.UPDATE(id),
      data
    )
  }

  createDishCategory(data:FormData):Observable<DishCategoryResponseDTO>{
    return this.httpClient.post<DishCategoryResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH_CATEGORY.CREATE,
      data
    )
  }

  getDishCategoryById(id:number):Observable<DishCategoryResponseDTO>{
    return this.httpClient.get<DishCategoryResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH_CATEGORY.FIND(id)
    )
  }

  updateDishCategoryById(id:number, data:FormData):Observable<DishCategoryResponseDTO>{
    return this.httpClient.patch<DishCategoryResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.DISH_CATEGORY.UPDATE(id),
      data
    )
  }

}
