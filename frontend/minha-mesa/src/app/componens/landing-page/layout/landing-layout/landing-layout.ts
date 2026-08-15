import { Component } from '@angular/core';
import { LandingHeader } from "../landing-header/landing-header";
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-landing-layout',
  imports: [LandingHeader, RouterOutlet],
  templateUrl: './landing-layout.html',
  styleUrl: './landing-layout.css',
})
export class LandingLayout {

}
