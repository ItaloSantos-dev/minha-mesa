import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-about-us-section',
  imports: [],
  templateUrl: './about-us-section.html',
  styleUrl: './about-us-section.css',
})
export class AboutUsSection {
  @ViewChild('aboutUsSection')
  aboutUsSectionDiv!: ElementRef<HTMLElement>;

  @ViewChild('ballBlue')
  ballBlueDiv!: ElementRef<HTMLElement>;

  @ViewChild('ballOrange')
  ballOrangeDiv!: ElementRef<HTMLElement>;

  @ViewChild('ballYellow')
  ballYellowDiv!: ElementRef<HTMLElement>;

  @ViewChild('cardReserve')
  cardReserveDiv!: ElementRef<HTMLElement>;

  @ViewChild('cardTable')
  cardTableDiv!: ElementRef<HTMLElement>;
}
