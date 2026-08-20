import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LOCALSTORAGETOKENKEY = 'token';
  getToken():string|null{
    return localStorage.getItem(this.LOCALSTORAGETOKENKEY)
  }

  clearToken(){
    localStorage.removeItem(this.LOCALSTORAGETOKENKEY);
  }
}
