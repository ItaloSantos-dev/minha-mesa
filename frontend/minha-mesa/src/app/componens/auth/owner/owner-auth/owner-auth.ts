import { Component, ElementRef, inject, QueryList, signal, ViewChild, ViewChildren,  } from '@angular/core';
import { Boxes } from "../../boxes/boxes";
import { OwnerRegister } from "../owner-register/owner-register";
import { OwnerLogin } from "../owner-login/owner-login";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { NgClass } from "@angular/common";

gsap.registerPlugin(MorphSVGPlugin);

@Component({
  selector: 'app-owner-auth',
  imports: [Boxes, OwnerRegister, OwnerLogin, NgClass, RouterLink],
  templateUrl: './owner-auth.html',
  styleUrl: './owner-auth.css',
})
export class OwnerAuth {
  private router = inject(Router)
  formShow = signal(-1);


  constructor (route:ActivatedRoute){
    const typeForm = route.snapshot.queryParamMap.get('form');
    if (typeForm) {
      if (typeForm==='login') {
        this.formShow.set(1)
      }
    }
  }

  @ViewChild('shape1')
  shape1Path!:ElementRef<SVGPathElement>

  updateFormShow(){
    this.router.navigate([], {
      queryParams: {}
    });
    this.formShow.set(this.formShow()*-1)
    this.updateSvgShape();
    
  }

  pathCircle = 'M100 20 C144 20 180 56 180 100 C180 144 144 180 100 180 C56 180 20 144 20 100 C20 56 56 20 100 20 Z';
  pathTriangle = 'M100 20 L180 170 L20 170 Z';

  @ViewChildren('shape')
  shapes!:QueryList<ElementRef<SVGPathElement>>;
  private updateSvgShape(){
    
    this.shapes.forEach(shape =>{
      if (this.formShow()==1) {
        gsap.to(shape.nativeElement, 
          {
            duration: .5,
            morphSVG: this.pathCircle,
            ease:'power2.inOut'
          }
        )
      }
      else{
        gsap.to(shape.nativeElement, 
          {
            duration: .5,
            morphSVG:this.pathTriangle,
            ease:'power2.inOut'
          }
        )
      }
    })
  }
}
