import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { ScrollNavigationService } from '../../../../service/scroll-navigation-service/scroll-navigation-service';


@Component({
  selector: 'app-landing-header',
  imports: [RouterLink],
  templateUrl: './landing-header.html',
  styleUrl: './landing-header.css',
})
export class LandingHeader {

  showHeader = signal(true);
  private lastScrollY = 0;

  scrollNavigationService = inject(ScrollNavigationService);

  @HostListener('window:scroll')
  onScroll() {

    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      this.showHeader.set(true);
      this.lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > this.lastScrollY) {
      this.showHeader.set(false);
    } else {
      this.showHeader.set(true);
    }

    this.lastScrollY = currentScrollY;
  }


  private router = inject(Router);

  navigateForLogin(){
    this.router.navigate(['/auth','owner'], {
      queryParams:{
        form:'login'
      }
    })
  }

  
}
