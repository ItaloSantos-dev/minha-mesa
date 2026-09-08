import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { gsap } from 'gsap/gsap-core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger)
@Component({
  selector: 'app-contact-us',
  imports: [],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs  {

  @ViewChild('mainDiv')
  mainDiv!: ElementRef<HTMLElement>

  @ViewChild('formMenssageDiv')
  formMenssageDiv!:ElementRef<HTMLElement>

  @ViewChild('imageDiv')
  imageDiv!:ElementRef<HTMLElement>

  
}
