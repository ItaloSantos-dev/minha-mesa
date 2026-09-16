import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserRegister } from '../user-register/user-register';
import { NgClass } from '@angular/common';
import { UserLogin } from '../user-login/user-login';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-user-auth',
  imports: [RouterLink, UserRegister, NgClass, UserLogin],
  templateUrl: './user-auth.html',
  styleUrl: './user-auth.css',
})
export class UserAuth  {
  private router = inject(Router);

  //1 = registrar,  2 = login
  formActive = signal(1);

  @ViewChild('imageLogin')
  imageLogin!:ElementRef<HTMLElement>;

  @ViewChild('imageRegister')
  imageRegister!: ElementRef<HTMLElement>;

  @ViewChild('main')
  main!: ElementRef<HTMLElement>;

  updateForm(value:number){
    this.formActive.set(value);
    if(value===2){
      gsap.to(
        [this.imageLogin.nativeElement, this.imageRegister.nativeElement],
        {
          duration:.5,
          x:'-100%',
          ease:'none'
        }
      )
      gsap.to(
        this.imageLogin.nativeElement,
        {
          opacity:0,
          ease:'none',
          duration:.5
        }
      )
      gsap.to(
        this.imageRegister.nativeElement,
        {
          opacity:1,
          ease:'none',
          duration:.5
        }
      )
    }

    else{
      gsap.to(
        [this.imageLogin.nativeElement, this.imageRegister.nativeElement],
        {
          duration:.5,
          x:'0%',
          ease:'none'
        }
      )
      gsap.to(
        this.imageRegister.nativeElement,
        {
          opacity:0,
          ease:'none',
          duration:.5
        }
      )
      gsap.to(
        this.imageLogin.nativeElement,
        {
          opacity:1,
          ease:'none',
          duration:.5
        }
      )
    }


  }

  @ViewChild('divMenssage')
  divMenssage!: ElementRef<HTMLElement>

  textMenssage = "";


  divMenssageClassList = "flex flex-col items-center justify-center h-[16vh] text-center font-[Poppins] w-[16vw] rounded-full z-11 bg-white/80 backdrop-blur-xl shadow-lg border border-gray-200/60 font-semibold -translate-y-full";
  iconMenssageClass = "text-4xl"
  handleShowMenssage() {
    gsap.timeline()
      .to(
        this.divMenssage.nativeElement, {
          y: '25vh',
          duration: 0.6,
          ease: 'power3.out'
        }
      )
      .to({}, { duration: 1 })
      .to(
        this.divMenssage.nativeElement, {
          y: '-100%',
          duration: 0.6,
          ease: 'power3.in'
      }
    );
  }

  showMenssage(menssage:string, success:boolean){
    console.log("Veio");
    
    this.iconMenssageClass += success===true? ' bi bi-check-circle-fill text-green-500' : ' bi bi-x-circle-fill text-red-500'
    this.textMenssage = menssage;
    this.handleShowMenssage();
  }

  

 


}
