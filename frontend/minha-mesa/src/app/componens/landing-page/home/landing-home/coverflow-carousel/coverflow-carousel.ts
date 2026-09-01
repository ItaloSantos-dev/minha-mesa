import { Component, ElementRef, inject, NgZone, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TestimonialCard } from "./testimonial-card/testimonial-card";
import { ScrollNavigationService } from '../../../../../service/scroll-navigation-service/scroll-navigation-service';

@Component({
  selector: 'app-coverflow-carousel',
  imports: [TestimonialCard],
  templateUrl: './coverflow-carousel.html',
  styleUrl: './coverflow-carousel.css',
})
export class CoverflowCarousel {

  private scrollNavigationService = inject(ScrollNavigationService);

items = [
  {
    name: 'Maria Silva',
    message: 'Trabalho incrível, a equipe entregou muito além do esperado. Super recomendo!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'João Souza',
    message: 'Ótimo atendimento, sistema rápido e muito bonito visualmente.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Ana Costa',
    message: 'Ajudou nossa empresa a dobrar o faturamento com um design super moderno.',
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    name: 'Pedro Alves',
    message: 'Nunca vi nada igual! O carrossel 3D ficou sensacional no nosso app.',
    image: 'https://randomuser.me/api/portraits/men/75.jpg'
  },
  {
    name: 'Lucas Lima',
    message: 'Profissionalismo impecável. Voltaremos a fazer negócios em breve.',
    image: 'https://randomuser.me/api/portraits/men/53.jpg'
  }
];



  // Configurações do Carrossel (substituindo as Props do React)
  rotate = 44;
  depth = 0.6;
  perspective = 3;
  falloff = 0.56;
  fade = 0.1;
  cardWidth = '320px'; // Ajustado para o tamanho do depoimento
  gap = 0.05;
  loop = true;
  showPagination = true;
  showNavigation = true;

  // Lógica Interna
  count = this.items.length;
  selected = 0;
  
  pos = 0;
  target = 0;
  width = 0;
  raf: number | null = null;
  drag: { id: number; x: number; pos: number; v: number; t: number } | null = null;
  resizeObserver!: ResizeObserver;

  @ViewChild('frameRef') frameRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef<HTMLDivElement>>;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    const measure = () => {
      const firstCard = this.cardRefs.first;
      if (firstCard) {
        this.width = firstCard.nativeElement.offsetWidth;
        this.paint();
      }
    };

    measure();
    this.resizeObserver = new ResizeObserver(measure);
    this.resizeObserver.observe(this.frameRef.nativeElement);

    
  }

  ngOnDestroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.raf !== null) cancelAnimationFrame(this.raf);
  }

  indexAt(pos: number) {
    console.log("INDO");
    
    return ((Math.round(pos) % this.count) + this.count) % this.count;
  }

  paint() {
    if (!this.width) return;
    const pitch = this.width * (1 + this.gap);
    const pos = this.pos;

    this.cardRefs.forEach((cardRef, index) => {
      const card = cardRef.nativeElement;
      let offset = index - pos;
      
      if (this.loop) {
        offset = ((offset % this.count) + this.count) % this.count;
        if (offset > this.count / 2) offset -= this.count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, this.falloff);
      const tilt = Math.min(this.rotate * ramp, 82) * Math.sign(offset);

      card.style.transform = 
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-this.depth * this.width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = this.loop ? Math.min(1, Math.max(0, this.count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - this.fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }

  settle(target: number) {
    
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.target = target;
    this.selected = this.indexAt(target);

    // Rodando o RequestAnimationFrame fora do NgZone para não travar o Angular com 60 atualizações por segundo
    this.ngZone.runOutsideAngular(() => {
      const step = () => {
        const remaining = target - this.pos;
        if (Math.abs(remaining) < 0.0004) {
          this.pos = target;
          this.paint();
          this.raf = null;
          return;
        }
        this.pos += remaining * 0.16;
        this.paint();
        this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
    });
  }

  clamp(pos: number) {
    return this.loop ? pos : Math.max(0, Math.min(this.count - 1, pos));
  }

  goTo(index: number) {
    const target = this.loop
      ? index + Math.round((this.target - index) / this.count) * this.count
      : index;
    this.settle(this.clamp(target));
  }

  nudge(by: number) {
    this.settle(this.clamp(Math.round(this.target) + by));
  }

  onPointerDown(event: PointerEvent) {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.target = this.pos;
    this.drag = {
      id: event.pointerId,
      x: event.clientX,
      pos: this.pos,
      v: 0,
      t: performance.now(),
    };
  }

  onPointerMove(event: PointerEvent) {
    
    if (!this.drag || this.drag.id !== event.pointerId) return;

    const pitch = this.width * (1 + this.gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = this.pos;
    this.pos = this.clamp(this.drag.pos - (event.clientX - this.drag.x) / pitch);
    this.drag.v = ((this.pos - previous) / Math.max(now - this.drag.t, 1)) * 1000;
    this.drag.t = now;
    const carried = Math.max(-2, Math.min(2, this.drag!.v * 0.18));


    const index = this.indexAt(this.pos);
    if (index !== this.selected) {
      // Atualiza o NgZone com o item selecionado (para a paginação/bolinhas funcionarem)
      this.ngZone.run(() => { this.selected = index; });
    }
    
    // Pinta fora do Angular
    this.paint();
  }

  endDrag(event: PointerEvent) {
    

    if (!this.drag || this.drag.id !== event.pointerId) return;
    this.drag = null;
    const carried = Math.max(-2, Math.min(2, this.drag!.v * 0.18));
    this.settle(this.clamp(Math.round(this.pos + carried)));
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      
      this.nudge(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nudge(1);
    }
  }
}
