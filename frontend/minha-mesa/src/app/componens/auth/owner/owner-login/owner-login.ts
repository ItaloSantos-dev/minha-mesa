import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../service/auth-service/auth-service';
import { LoginRequestDTO } from '../../../../types/auth/login-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-login',
  imports: [ReactiveFormsModule],
  templateUrl: './owner-login.html',
  styleUrl: './owner-login.css',
})
export class OwnerLogin {
  private authservice = inject(AuthService);
  formLoginOwner = new FormGroup({
    email:new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl ('', [Validators.required, Validators.minLength(8)])
  });

  showPassword = signal(false);
  
  generateLoginRequest():LoginRequestDTO{
    return {
      email: this.formLoginOwner.get('email')?.value as string,
      password: this.formLoginOwner.get('password')?.value as string
    }
  }


  ngOnSubmit(){
    if (!this.formLoginOwner.valid)
      return
    this.authservice.login(this.generateLoginRequest()).subscribe({
      next:(data) =>{
        this.authservice.setToken(data)
      },
      error:(erro)=>{
        console.log(erro);
        
      }
    })
  }
}
