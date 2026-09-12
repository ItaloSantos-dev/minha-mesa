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

  getToken():string|null{
    return localStorage.getItem(this.LOCALSTORAGETOKENKEY)
  }

  clearToken(){
    localStorage.removeItem(this.LOCALSTORAGETOKENKEY);
  }

  login(data:LoginRequestDTO):Observable<string>{
    return this.httpClient.post(API_BACK_CONFIG.URL + API_BACK_CONFIG.ENDPOINTS.AUTH.LOGIN, data, {responseType:'text'});
  }

  register(data: RegisterRequestDTO):Observable<UserResponseDTO>{
    return this.httpClient.post<UserResponseDTO>(API_BACK_CONFIG.URL + API_BACK_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  }

  setToken(token:string){
    localStorage.setItem('token', token);
  }
}
