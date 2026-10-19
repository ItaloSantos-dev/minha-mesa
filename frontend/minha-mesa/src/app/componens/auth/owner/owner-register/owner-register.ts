import { Component, computed, ElementRef, inject, output, signal, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email, form } from '@angular/forms/signals';
import { NgxMaskDirective } from 'ngx-mask';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { CreateRestaurantRequestDTO } from '../../../../types/restaurant/create-restaurant-request';
import { AuthService } from '../../../../service/auth-service/auth-service';
import { RegisterRequestDTO } from '../../../../types/auth/register-request';
import { CreateOwnerRequestDTO } from '../../../../types/owner/create-owner-request';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { gsap } from 'gsap/gsap-core';

interface formDataCreateRestaurant{
  data:CreateRestaurantRequestDTO,
  imagePerfilPath:string;
  imageBannerPath:string;
}

@Component({
  selector: 'app-owner-register',
  imports: [ReactiveFormsModule, NgxMaskDirective, RouterLink],
  templateUrl: './owner-register.html',
  styleUrl: './owner-register.css',
})
export class OwnerRegister {

  private restaurantService = inject(RestaurantService);
  private authService = inject(AuthService);
  private exceptionService = inject(ExceptionService);
  private utilityService = inject(UtilityService);
  private router = inject(Router);

  formMainDivClass = computed(() =>{
    let classList = 'flex w-[300%] transition-transform duration-500 ease-in-out ';
    if (this.formShow()===1) {
      classList += '-translate-x-1/3'
    }
    else if(this.formShow()===2){
      classList += '-translate-x-2/3'
    }
    return classList;
  })

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
  formShow = signal(0);

  
  
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

  imagePerfilPath = signal('');
  imagePerfilFile! :File | null; 

  imageBannerPath = signal('');
  imageBannerFile! :File | null; 

  expandImage = output<string>();

  emitExpandImage(imageUrl:string){
    
    this.expandImage.emit(imageUrl);
  }

  divInputImageClass = 'border-2 border-dashed border-slate-200 hover:border-(--color-primary) rounded-2xl p-4 transition-all bg-slate-50/50 flex flex-col items-center justify-center text-center h-36 cursor-pointer group relative overflow-hidden'

  onFileSelected(event: Event, control:number) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const file = input.files[0];

      if (control===0) {
        this.imagePerfilPath.set(URL.createObjectURL(file))
        this.imagePerfilFile = file;
      }
      else{
        this.imageBannerPath.set(URL.createObjectURL(file))
        this.imageBannerFile = file;
      }

      
    }

  }
  @ViewChild('menssageSuccessLogin')
  menssageSuccessLogin!: ElementRef<HTMLParagraphElement>

  showMenssageSuccessLogin(show:boolean){
    const opacity = show? 1 : 0;
    const positionX = show? 0 : 100;

    gsap.to(
      this.menssageSuccessLogin.nativeElement,
      {
        opacity:opacity,
        x:positionX,
        duration:.3,
        onComplete:() =>{
          if (show) {
            setTimeout(() => {
                this.showMenssageSuccessLogin(false);
            }, 5000);
          }
          else{
            gsap.set(this.menssageSuccessLogin.nativeElement,{x:-100})
          }
        }
      }
    )
  }

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


  handlerShowError(erro:HttpErrorResponse){
    this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(erro));
  }

  formPartIsInvalid(position:number){
    const fields = [
      [
        'userName',
        'email',
        'userPhone',
        'password',
        'cpf',
        'nasciment'
      ],
      [
        'restaurantName',
        'restaurantAddress'
      ]

    ];

    let haveFieldInvalid =  fields[position].some(field =>
      this.formRegisterOwner.get(field)?.valid === false
    );
    console.log("haveFieldInvalid " + position + haveFieldInvalid);
    
    if (position===1) {
      const restaurantPhonefieldIsInvalid = this.useNumberOwnerInNuberRestaurant()? false : this.formRegisterOwner.get('restaurantPhone')?.invalid as boolean
      console.log("restaurantPhonefieldIsInvalid " + restaurantPhonefieldIsInvalid);
      if (restaurantPhonefieldIsInvalid)
        return true
    }

    return haveFieldInvalid;
  }


  formInvalid():boolean{
    const formValid = this.formPartIsInvalid(0) && this.formPartIsInvalid(1);
    if(formValid || this.imageBannerPath()==='' || this.imagePerfilPath()==='')
      return true;

    return false;

  }

  generateFormDataCreateRestaurantRequest():FormData{
    const formData = new FormData();

    formData.append('data', new Blob([JSON.stringify(this.generateCreateRestaurantRequest())], {type: 'application/json'}));
    formData.append('imagePerfil', this.imagePerfilFile as File);
    formData.append('imageBanner', this.imageBannerFile as File);

    return formData;

  }

  ngOnSubmit(){
    if (this.formRegisterOwner.invalid) 
      return;

    this.authService.clearToken();
    this.restaurantService.createRestaurant(this.generateFormDataCreateRestaurantRequest()).subscribe({
      next:(data) =>{
        this.formShow.set(0);
        this.imageBannerFile = null;
        this.imagePerfilFile = null;
        this.imagePerfilPath.set('');
        this.imageBannerPath.set('');
        this.formRegisterOwner.reset();
        this.showMenssageSuccessLogin(true);
      },
      error:(erro: HttpErrorResponse)=>{
        const showError = this.exceptionService.handlerRedirectExceptionResponse(erro, '');
        if (showError) {
          this.handlerShowError(erro);
        }
      }
    })
  }
}
