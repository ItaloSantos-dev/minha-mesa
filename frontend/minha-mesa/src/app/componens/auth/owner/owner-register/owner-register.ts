import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { NgxMaskDirective } from 'ngx-mask';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { CreateRestaurantRequestDTO } from '../../../../types/restaurant/create-restaurant-request';
import { AuthService } from '../../../../service/auth-service/auth-service';
import { RegisterRequestDTO } from '../../../../types/auth/register-request';
import { CreateOwnerRequestDTO } from '../../../../types/owner/create-owner-request';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-owner-register',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './owner-register.html',
  styleUrl: './owner-register.css',
})
export class OwnerRegister {

  private restaurantService = inject(RestaurantService);
  private authService = inject(AuthService);

  formRegisterOwner = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email:new FormControl('', [Validators.email, Validators.required]),
    userPhone: new FormControl('', [Validators.maxLength(11), Validators.minLength(8), Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    cpf: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(8)]),
    nasciment:new FormControl('', [Validators.required]),
    restaurantName: new FormControl('', [Validators.required]),
    restaurantAddress: new FormControl('', [Validators.required]),
    restaurantPhone: new FormControl('', [Validators.maxLength(11), Validators.minLength(8), Validators.required]),
  });



  showPassword = signal(false);
  formShow = signal(1);
  
  formValue = toSignal(
  this.formRegisterOwner.valueChanges,
  {
    initialValue: this.formRegisterOwner.value
  }
);

ownerFormPartIsValid = computed(() => {
  this.formValue();

  const fields = [
    'userName',
    'email',
    'userPhone',
    'password',
    'cpf',
    'nasciment'
  ];

  return fields.every(field =>
    this.formRegisterOwner.get(field)?.valid === true
  );
});

  generateCreateRestaurantRequest():CreateRestaurantRequestDTO{
    
    const registerRequestDTO:RegisterRequestDTO = {
      name:this.formRegisterOwner.get('userName')?.value as string,
      email:this.formRegisterOwner.get('email')?.value as string,
      phone:this.formRegisterOwner.get('userPhone')?.value as string,
      password:this.formRegisterOwner.get('password')?.value as string,
    }

    const createOwnerRequestDTO: CreateOwnerRequestDTO = {
      cpf:this.formRegisterOwner.get('cpf')?.value as string,
      nasciment:this.formRegisterOwner.get('nasciment')?.value as string,
      userData:registerRequestDTO
    }

    return {
      name:this.formRegisterOwner.get('restaurantName')?.value as string,
      address:this.formRegisterOwner.get('restaurantAddress')?.value as string,
      phone:this.formRegisterOwner.get('restaurantPhone')?.value as string,
      ownerData:createOwnerRequestDTO
    }
  }

  useNumberOwnerInNuberRestaurant = signal(false);
  oldRestaurantNumber = signal('');

  updateNumberOfRestaurant(){
    this.useNumberOwnerInNuberRestaurant.set(!this.useNumberOwnerInNuberRestaurant())
    if (this.useNumberOwnerInNuberRestaurant()) {
      this.formRegisterOwner.get('restaurantPhone')?.disable()
      this.oldRestaurantNumber.set(this.formRegisterOwner.get('restaurantPhone')?.value as string)
      this.formRegisterOwner.controls.restaurantPhone.setValue(this.formRegisterOwner.get('userPhone')?.value as string)
    }
    else{
      this.formRegisterOwner.get('restaurantPhone')?.enable()
      this.formRegisterOwner.controls.restaurantPhone.setValue(this.oldRestaurantNumber())
    }
  }

  ngOnSubmit(){
    if (!this.formRegisterOwner.valid) 
      return;

    this.authService.clearToken();
    this.restaurantService.createRestaurant(this.generateCreateRestaurantRequest()).subscribe({
      next:(data) =>{
        console.log('Deu bom');
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
}
