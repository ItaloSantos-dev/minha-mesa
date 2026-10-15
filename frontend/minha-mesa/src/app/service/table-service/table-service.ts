import { inject, Injectable } from '@angular/core';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTableRequestDTO } from '../../types/table/create-table-request';
import { TableResponseDTO } from '../../types/table/table-response';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private readonly url = API_BACK_CONFIG.URL;
  private httpClient = inject(HttpClient); 

  updateStatusOfTableById(id:number):Observable<void>{
    console.log("FAZENDO UPDATE");
    
    return this.httpClient.patch<void>(
      this.url + API_BACK_CONFIG.ENDPOINTS.TABLE.UPDATE_STATUS(id), null
    )
  }

  createTable(data:CreateTableRequestDTO):Observable<TableResponseDTO>{
    return this.httpClient.post<TableResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.TABLE.CREATE,
      data
    )
  }
}
