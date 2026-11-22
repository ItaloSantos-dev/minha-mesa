import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {
  @ViewChild('heroSection')
  heroSectionDiv!: ElementRef<HTMLElement>;
}
