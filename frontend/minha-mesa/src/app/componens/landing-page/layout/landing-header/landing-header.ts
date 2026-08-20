import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-landing-header',
  imports: [RouterLink],
  templateUrl: './landing-header.html',
  styleUrl: './landing-header.css',
})
export class LandingHeader {

  private router = inject(Router);

  navigateForLogin(){
    this.router.navigate(['/auth','owner'], {
      queryParams:{
        form:'login'
      }
    })
  }
}
