import { AfterViewInit, Component, ElementRef, HostListener, inject, signal, viewChild, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollNavigationService } from '../../../../service/scroll-navigation-service/scroll-navigation-service';
import { TestimonialCard } from "./coverflow-carousel/testimonial-card/testimonial-card";
import { CoverflowCarousel } from "./coverflow-carousel/coverflow-carousel";

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing-home',
  imports: [RouterLink, TestimonialCard, CoverflowCarousel],
  templateUrl: './landing-home.html',
  styleUrl: './landing-home.css',
})

export class LandingHome implements AfterViewInit{
  private scrollNavigationService = inject(ScrollNavigationService);
  

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

  @ViewChild('heroSection')
  heroSectionDiv!: ElementRef<HTMLElement>;

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

  @ViewChild('horizontalScrollDiv')
  horizontalScrollDiv !: ElementRef<HTMLElement>

  @ViewChild('carrousel', { read: ElementRef })
  carrouselDiv!: ElementRef<HTMLElement>;


  private horizontalTrigger!: ScrollTrigger;



  ngAfterViewInit(): void {
    
    ScrollTrigger.create({
      trigger: this.heroSectionDiv.nativeElement,
      start: '70% top',
      end: 'bottom top',
      snap: {
        snapTo: 1,
        duration: 0.5
      }
    });



    const ballBlue = this.ballBlueDiv.nativeElement;
    const ballOrange = this.ballOrangeDiv.nativeElement;
    const ballYellow = this.ballYellowDiv.nativeElement;

    const aboutUsSection = this.aboutUsSectiondiv.nativeElement;
    const cardReserve = this.cardReserveDiv.nativeElement;
    const cardTable = this.cardTableDiv.nativeElement;

    // animações da seção sobre
    gsap.timeline({
      scrollTrigger: {
        trigger: aboutUsSection,
        start: 'top bottom',
        end: '-10% top',
        scrub: 1
        
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
//
    
    const horizontalScroll = this.horizontalScrollDiv.nativeElement;
    const carrousel = this.carrouselDiv.nativeElement;
    console.log(carrousel);

    
    let triggered = false;
    gsap.timeline({
      scrollTrigger:{
        trigger: horizontalScroll,
        start:'top top',
        end:'+=100%',
        pin:true,
        scrub: 1,
        markers: false,
        snap: {
          snapTo: 1,
          duration: 0.5,
          ease: 'none'
        },

        onRefresh: (self) => {
          this.horizontalTrigger = self;
        }
      }
    }).fromTo(
      horizontalScroll,
      {
        translateX:'0%'
      },
      {
        translateX:'-50%',
        ease:'none'
      }
    ).fromTo(
      [ballBlue, ballOrange, ballYellow, cardReserve, cardTable],
      {
        translateX:'0'
      },
      {
        translateX:'-100vw',
        ease:'none'
      },
      '<'


    ).fromTo(
      carrousel,
      {
        translateX:"80vw"
      },
      {
        translateX:'0',
        ease:'none'
      },
      '<'
    )
    
    



    this.scrollNavigationService.section$.subscribe(section => {
      this.navigateToSection(section);
    });


    


    

    
  }

  private navigateToSection(section: string): void {
    if (section==='heroSection') {
      window.scrollTo({
        top: this.heroSectionDiv.nativeElement.offsetTop,
        behavior: 'smooth'
      });
    }
    else if(section==='aboutUsSection'){
      window.scrollTo({
        top:this.horizontalTrigger.start,
        behavior: 'smooth'
      })
    }
    if (section === 'testimonialsSection') {

      window.scrollTo({
        top: this.horizontalTrigger.end,
        behavior: 'smooth'
      });

    }
    

  }

  
}
