import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ExceptionResponse } from '../../types/exception/excpetion-response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExceptionService {
  private router = inject(Router);
  statusForOwnPage = [
      400,
      401,
      409
  ];

  statusForOtherPage = [
      403,
      404
  ];

  handlerRedirectExceptionResponse(erro:HttpErrorResponse):boolean{
    const exception:ExceptionResponse = ExceptionResponse.fromHttpError(erro);

    if (this.statusForOtherPage.includes(exception.status)) {
      const path = exception.status === 404 ? '/not-found' : '/not-permited';
      this.router.navigate([path]);
      return false;
    }
    else if(this.statusForOwnPage.includes(exception.status)){
      return true;
    }

    return true;
  }
}
