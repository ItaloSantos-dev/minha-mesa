import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { HttpClient } from '@angular/common/http';
import { CreateWorkingScheduleRequestDTO } from '../../types/working_schedule/create-working-schedule-request';
import { Observable } from 'rxjs';
import { WorkingScheduleResponseDTO } from '../../types/working_schedule/working-schedule-response';

@Injectable({
  providedIn: 'root',
})
export class WorkingScheduleService {
  private readonly url = API_BACK_CONFIG.URL;
  private httpClient = inject(HttpClient);

  createWorkingSchedule(data:CreateWorkingScheduleRequestDTO):Observable<WorkingScheduleResponseDTO>{
    console.log(this.url + API_BACK_CONFIG.ENDPOINTS.WORKING_SCHEDULEDS);
    
    return this.httpClient.post<WorkingScheduleResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.WORKING_SCHEDULEDS.CREATE,
      data
    )
  }
}
