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

  deleteTableById(id:number):Observable<void>{
    console.log(this.url + API_BACK_CONFIG.ENDPOINTS.TABLE + `/${id}`);
    
    return this.httpClient.delete<void>(
      this.url + API_BACK_CONFIG.ENDPOINTS.TABLE.DELETE + `/${id}`
    )
  }

  createTable(data:CreateTableRequestDTO):Observable<TableResponseDTO>{
    return this.httpClient.post<TableResponseDTO>(
      this.url + API_BACK_CONFIG.ENDPOINTS.TABLE.DELETE,
      data
    )
  }
}
