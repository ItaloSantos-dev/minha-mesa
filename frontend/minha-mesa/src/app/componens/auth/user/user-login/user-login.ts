import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../service/auth-service/auth-service';
import { LoginRequestDTO } from '../../../../types/auth/login-request';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';

@Component({
  selector: 'app-user-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './user-login.html',
  styleUrl: './user-login.css',
})
export class UserLogin {
  loginActive = output<void>();

  authService = inject(AuthService);

  private utilityService = inject(UtilityService);
  private exceptionService = inject(ExceptionService);

  inputClassList = 'bg-white/60 backdrop-blur-2xl rounded-xl p-1 focus:border-(--color-primary) focus:outline-none h-[5vh]';

  menssageOfErrosFormRegister = new Map<string, string>([
    ['name', 'Este nome é inválido'],
    ['phone', 'Este telefone é inválido'],
    ['email', 'Este email está inválido'],
    ['password', 'Esta senha está inválida']
  ])

  formLoginUser = new FormGroup({
    email:new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  updateForm(){
    this.loginActive.emit();
  }

  generateLoginRequest():LoginRequestDTO{
    return {
      email: this.formLoginUser.get('email')?.value as string,
      password: this.formLoginUser.get('password')?.value as string
    }
  }

  handlerShowError(erro:HttpErrorResponse){
    this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(erro));
  }

  ngOnSubmit(){
    if (this.formLoginUser.invalid) {
      return;
    }
    this.authService.login(this.generateLoginRequest()).subscribe({
      next:(token) =>{
        console.log("Deu bom");
        
        this.authService.setToken(token);
      },
      error:(erro: HttpErrorResponse)=>{
        const showError = this.exceptionService.handlerRedirectExceptionResponse(erro);
        if (showError) {
          this.handlerShowError(erro);
        }
      }
    })
  }

  getErrorsMessagesForms() {
    const errors:string[] = [];
    Object.entries(this.formLoginUser.controls).forEach(([controlName, control]) =>{
      if (control.invalid && control.touched) {
        const message = this.menssageOfErrosFormRegister.get(controlName);

        if (message) {
          errors.push(message);
        }
      }
    });
    return errors;
  }
}
