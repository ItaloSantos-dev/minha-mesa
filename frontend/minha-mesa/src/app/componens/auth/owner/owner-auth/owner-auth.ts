import { Component, inject, signal } from '@angular/core';
import { Boxes } from "../../boxes/boxes";
import { OwnerRegister } from "../owner-register/owner-register";
import { OwnerLogin } from "../owner-login/owner-login";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-owner-auth',
  imports: [Boxes, OwnerRegister, OwnerLogin],
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


  updateFormShow(){
    this.router.navigate([], {
      queryParams: {}
    });
    this.formShow.set(this.formShow()*-1)
  }
}
