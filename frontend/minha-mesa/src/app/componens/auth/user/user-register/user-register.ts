import { Component, inject, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { AuthService } from '../../../../service/auth-service/auth-service';
import { RegisterRequestDTO } from '../../../../types/auth/register-request';

@Component({
  selector: 'app-user-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './user-register.html',
  styleUrl: './user-register.css',
})
export class UserRegister {
  userAcceptedTerms = signal(false);
  authService = inject(AuthService);
  router = inject(Router);

  registerActive = output<void>();

  updateForm(){
    this.registerActive.emit();
  }

  menssageForFather = output<[string, boolean]>();

  sendMenssageForFather(menssage:string, success:boolean){
    this.menssageForFather.emit(["Login feito com sucesso", success])
  }


  menssageOfErrosFormRegister = new Map<string, string>([
    ['name', 'Este nome é inválido'],
    ['phone', 'Este telefone é inválido'],
    ['email', 'Este email está inválido'],
    ['password', 'Esta senha está inválida']
  ])

  inputClassList = 'bg-white/60 backdrop-blur-2xl rounded-xl p-1 focus:border-(--color-primary) focus:outline-none h-[5vh]';

  formRegisterUser = new FormGroup({
    name:new FormControl('',[Validators.required]),
    phone:new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    email:new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  getErrorsMessagesForms() {
    
    const errors:string[] = [];
    Object.entries(this.formRegisterUser.controls).forEach(([controlName, control]) =>{
      if (control.invalid && control.touched) {
        const message = this.menssageOfErrosFormRegister.get(controlName);

        if (message) {
          errors.push(message);
        }
      }
    });
    return errors;
  }

  formIsValid(){
    return this.formRegisterUser.invalid || !this.userAcceptedTerms()
  }

  generateRegisterRequest():RegisterRequestDTO{
    return{
      name:this.formRegisterUser.get('name')?.value as string,
      phone:this.formRegisterUser.get('phone')?.value as string,
      email:this.formRegisterUser.get('email')?.value as string,
      password:this.formRegisterUser.get('password')?.value as string,
    }
  }
  private mensageSuccessRegister = "Registro realizado com sucesso, agora faça seu login";

  ngOnSubmit(){
    if (this.formRegisterUser.invalid) {
      return
    }
    console.log(this.generateRegisterRequest());
    
    this.authService.register(this.generateRegisterRequest()).subscribe({
      next:(data) =>{
        this.updateForm();
        this.sendMenssageForFather(this.mensageSuccessRegister, true);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
