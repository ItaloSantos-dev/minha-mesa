import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ExceptionResponse } from '../../types/exception/excpetion-response';
import { Router } from '@angular/router';
import { UtilityService } from '../utility-service/utility-service';
import { NotFound } from '../../componens/not-found/not-found';

@Injectable({
  providedIn: 'root',
})
export class ExceptionService {
  private router = inject(Router);
  private utilityservice = inject(UtilityService);

  
  statusForOwnPage = [
      400,
      401,
      409
  ];

  statusForOtherPage = [
      403,
      404
  ];

  handlerRedirectExceptionResponse(erro:HttpErrorResponse, urlForBack:string):boolean{
    const exception:ExceptionResponse = ExceptionResponse.fromHttpError(erro);

    if (this.statusForOtherPage.includes(exception.status)) {
      const path = exception.status === 404 ? '/not-found' : '/not-permited';
      
      this.router.navigate([path],{
        state:{
          returnUrl:urlForBack
        }
      });
      return false; 
    }
    else if(this.statusForOwnPage.includes(exception.status)){
      return true;
    }

    return true;
  }
}
