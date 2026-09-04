import {Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FeatureCard } from "./feature-card/feature-card";



@Component({
  selector: 'app-features',
  imports: [FeatureCard],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features  {


  @ViewChildren('featureCard', { read: ElementRef }) 
  featureCards!: QueryList<ElementRef<HTMLElement>>;

  
}
