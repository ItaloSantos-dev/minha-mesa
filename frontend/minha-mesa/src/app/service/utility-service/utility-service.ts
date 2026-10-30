import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ExceptionResponse } from '../../types/exception/excpetion-response';
import { RestaurantResponseDTO } from '../../types/restaurant/restaurant-response';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {


  static pathsOfApplication ={
    OWNER_DASHBOARD: 'owner/restaurant/dashboard',
    OWNER_SHOW_RESERVES: 'owner/restaurant/reservations',
    OWNER_SHOW_TABLES: 'owner/restaurant/tables',
    OWNER_SHOW_WORKING_SCHEDULES: 'owner/restaurant/working-schedules',
    OWNER_SHOW_SCHEDULE_EXCEPTIONS: 'owner/restaurant/schedule-exceptions',
    CLIENT_HOME: 'client/home'
  }

  private updateCurrentPageSubject = new Subject<number>();
  updateCurrentPage$ = this.updateCurrentPageSubject.asObservable();

  updateCurrentPageOfOwnerMenu(value:number){
    this.updateCurrentPageSubject.next(value);
  }

  private showMenssageErrorSubject = new Subject<ExceptionResponse>();
  showMenssageErrorSubject$ = this.showMenssageErrorSubject.asObservable();

  handlerShowMenssageErrorSubject(exception:ExceptionResponse){
    console.log(exception);
    
    this.showMenssageErrorSubject.next(exception);
  }


}
