import { AfterViewInit, Component, ElementRef, HostListener, signal, viewChild, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AccordionGalleryComponent, AccordionGalleryItem } from './accordion-gallery/accordion-gallery';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing-home',
  imports: [RouterLink, AccordionGalleryComponent],
  templateUrl: './landing-home.html',
  styleUrl: './landing-home.css',
})

export class LandingHome implements AfterViewInit{
  galleryItems: AccordionGalleryItem[] = [
    { image: 'images/prints/hero-home.png', label: 'Mesas', link: '' },
    { image: 'images/prints/hero-home.png', label: 'Pratos', link: ''},
    { image: 'images/prints/hero-home.png', label: 'Reservas', link: '' },
    { image: 'images/prints/hero-home.png', label: 'Organização', link: '' },
    { image: 'images/prints/hero-home.png', label: 'Distribuição', link: '' }
  ];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  onScroll(): void {
    const el = this.scrollContainer.nativeElement;
    
    // Verifica se chegou ao fim do scroll horizontal (com margem de tolerância de 5px)
    const reachedEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    if (reachedEnd) {
      // Retorna para o início com animação suave
      el.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  @ViewChild('ballBlue')
  ballBlueDiv!: ElementRef<HTMLElement>;

  @ViewChild('ballOrange')
  ballOrangeDiv!: ElementRef<HTMLElement>;

  @ViewChild('ballYellow')
  ballYellowDiv!: ElementRef<HTMLElement>;

  @ViewChild('aboutUsSection')
  aboutUsSectiondiv!: ElementRef<HTMLElement>;

  @ViewChild('cardReserve')
  cardReserveDiv !: ElementRef<HTMLElement>

  @ViewChild('cardTable')
  cardTableDiv !: ElementRef<HTMLElement>

  ngAfterViewInit(): void {
    const ballBlue = this.ballBlueDiv.nativeElement;
    const ballOrange = this.ballOrangeDiv.nativeElement;
    const ballYellow = this.ballYellowDiv.nativeElement;

    const aboutUsSection = this.aboutUsSectiondiv.nativeElement;
    const cardReserve = this.cardReserveDiv.nativeElement;
    const cardTable = this.cardTableDiv.nativeElement;

    gsap.timeline({
      scrollTrigger: {
        trigger: aboutUsSection,
        start: 'top bottom',
        end: '-10% top',
        scrub: 1,
        markers: true
      }
    }).fromTo(
      [ballBlue, ballOrange, ballYellow],
      {
        scale: 100,
        opacity:1
      },
      {
        scale: 20,
        transformOrigin: 'top center',
        opacity:.5,
        ease:'none'
      }
    ).fromTo(
      cardReserve,{
        rotation: -60,
        y:'-25vh'
      },
      {
        rotation:0,
        y:'0',
        ease:'none'
      },
      '<'
    ).fromTo(
      cardTable,{
        rotation: 60,
        x:'25vw'
      },
      {
        rotation:0,
        x:'0',
        ease:'none'
      },
      '<'
    )


    

    
  }

}
