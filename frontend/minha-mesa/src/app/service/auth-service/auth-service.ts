import { inject, Injectable } from '@angular/core';
import { RegisterRequestDTO } from '../../types/auth/register-request';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BACK_CONFIG } from '../../config/api-back-config';
import { LoginRequestDTO } from '../../types/auth/login-request';
import { UserResponseDTO } from '../../types/user/user-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LOCALSTORAGETOKENKEY = 'token';

  private httpClient = inject(HttpClient);

  

  login(data:LoginRequestDTO):Observable<void>{
    localStorage.clear()
    return this.httpClient.post<void>(API_BACK_CONFIG.URL + API_BACK_CONFIG.ENDPOINTS.AUTH.LOGIN, data);
  }

  register(data: RegisterRequestDTO):Observable<UserResponseDTO>{
    return this.httpClient.post<UserResponseDTO>(API_BACK_CONFIG.URL + API_BACK_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  }

}
