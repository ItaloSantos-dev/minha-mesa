import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { HttpClient } from '@angular/common/http';
import { CreateWorkingScheduleRequestDTO } from '../../types/working_schedule/create-working-schedule-request';
import { Observable } from 'rxjs';
import { ScheduleExceptionResponseDTO } from '../../types/schedule_exception/schedule-exception-response';
import { CreateScheduleExceptionRequestDTO } from '../../types/schedule_exception/create-schedule-exception-request';

@Injectable({
  providedIn: 'root',
})
export class ScheduleExceptionService {
  private readonly url = API_BACK_CONFIG.URL;
  private httClient = inject(HttpClient);

  createWorkingScheduleException(data:CreateScheduleExceptionRequestDTO):Observable<ScheduleExceptionResponseDTO>{
    return this.httClient.post<ScheduleExceptionResponseDTO>(this.url + API_BACK_CONFIG.ENDPOINTS.SCHEDULE_EXCEPTION.CREATE, data);
  }

  updateStatusScheduleExceptionById(id:number):Observable<void>{
    console.log(this.url + API_BACK_CONFIG.ENDPOINTS.SCHEDULE_EXCEPTION.UPDATE_STATUS(id));
    
    return this.httClient.patch<void>(this.url + API_BACK_CONFIG.ENDPOINTS.SCHEDULE_EXCEPTION.UPDATE_STATUS(id), null);
  }

}
