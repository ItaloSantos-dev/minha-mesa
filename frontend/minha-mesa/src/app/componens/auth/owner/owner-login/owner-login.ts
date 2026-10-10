import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../service/auth-service/auth-service';
import { LoginRequestDTO } from '../../../../types/auth/login-request';
import { Router } from '@angular/router';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { MessageError } from '../../../message-error/message-error';
import { UtilityService } from '../../../../service/utility-service/utility-service';

@Component({
  selector: 'app-owner-login',
  imports: [ReactiveFormsModule, MessageError],
  templateUrl: './owner-login.html',
  styleUrl: './owner-login.css',
})
export class OwnerLogin {
  private authservice = inject(AuthService);
  private router = inject(Router);
  private exceptionService = inject(ExceptionService);
  private utilityService = inject(UtilityService);

  formLoginOwner = new FormGroup({
    email:new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl ('', [Validators.required, Validators.minLength(8)])
  });

  showMessageError = signal(false);

  showPassword = signal(false);
  
  generateLoginRequest():LoginRequestDTO{
    return {
      email: this.formLoginOwner.get('email')?.value as string,
      password: this.formLoginOwner.get('password')?.value as string
    }
  }

  handlerShowError(erro:HttpErrorResponse){
    this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(erro));
  };


  ngOnSubmit(){
    if (!this.formLoginOwner.valid)
      return
    this.authservice.login(this.generateLoginRequest()).subscribe({
      next:(data) =>{
        this.authservice.setToken(data);
        this.router.navigate(['owner', 'restaurant', 'dashboard'])
      },
      error:(erro: HttpErrorResponse)=>{
        const showError = this.exceptionService.handlerRedirectExceptionResponse(erro);
        if (showError) {
          this.handlerShowError(erro);
        }
      }
    })
  }
}
