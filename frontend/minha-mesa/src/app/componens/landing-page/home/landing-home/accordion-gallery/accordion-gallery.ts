import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  OnInit,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostListener,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

export interface AccordionGalleryItem {
  image: string;
  label?: string;
  link?: string;
  alt?: string;
}

@Component({
  selector: 'app-accordion-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-gallery.html',
  styleUrl: './accordion-gallery.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionGalleryComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() items: AccordionGalleryItem[] = [
    { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
    { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
    { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
    { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
    { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
  ];
  @Input() defaultIndex: number = 2;
  @Input() accentColor: string = '#ffffff';
  @Input() overlayColor: string = '#060010';
  @Input() textColor: string = '#ffffff';
  @Input() height: number = 460;
  @Input() gap: number = 10;
  @Input() radius: number = 16;
  @Input() expandRatio: number = 0.52;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() duration: number = 0.6;
  @Input() ease: string = 'power3.out';
  @Input() parallax: number = 0.5;
  @Input() tilt: number = 8;
  @Input() stagger: number = 0.06;
  @Input() trigger: 'hover' | 'click' = 'hover';
  @Input() showLabels: boolean = true;
  @Input() grayscale: boolean = true;

  @ViewChild('rootRef', { static: true }) rootRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('panelRef') panelRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('mediaRef') mediaRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('barRef') barRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('textRef') textRefs!: QueryList<ElementRef<HTMLElement>>;

  active: number = 0;
  private tl: gsap.core.Timeline | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private firstRun: boolean = true;
  private mediaSize: number = 320;
  private prefersReduced: boolean = false;

  ngOnInit(): void {
    this.active = Math.min(Math.max(this.defaultIndex, 0), this.items.length - 1);
    this.prefersReduced =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
  }

  ngAfterViewInit(): void {
    this.setupResizeObserver();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.firstRun) {
      this.applyLayout(true);
    }
  }

  ngOnDestroy(): void {
    this.tl?.kill();
    this.resizeObserver?.disconnect();
  }

  get vertical(): boolean {
    return this.orientation === 'vertical';
  }

  get overlayBg(): string {
    return `linear-gradient(180deg, transparent 45%, color-mix(in srgb, ${this.overlayColor} 78%, transparent) 100%), color-mix(in srgb, ${this.overlayColor} calc(var(--ag-dim, 0.35) * 100%), transparent)`;
  }

  get containerHeight(): string {
    return this.vertical ? `${Math.round(this.height * 1.6)}px` : `${this.height}px`;
  }

  private setupResizeObserver(): void {
    const el = this.rootRef.nativeElement;
    this.measure(el);

    this.resizeObserver = new ResizeObserver(() => this.measure(el));
    this.resizeObserver.observe(el);
  }

  private measure(el: HTMLElement): void {
    const count = this.items.length;
    const rect = el.getBoundingClientRect();
    const total = this.vertical ? rect.height : rect.width;
    const usable = Math.max(total - this.gap * (count - 1), 120);
    const size = Math.max(140, usable * Math.min(Math.max(this.expandRatio, 0.2), 0.9) * 1.22);
    this.mediaSize = size;
    el.style.setProperty('--ag-media-size', `${size}px`);

    this.applyLayout(!this.firstRun);
    this.firstRun = false;
  }

  private applyLayout(animate: boolean): void {
    const panels = this.panelRefs?.toArray().map(r => r.nativeElement) || [];
    if (!panels.length) return;

    const count = this.items.length;
    const r = Math.min(Math.max(this.expandRatio, 0.2), 0.9);
    const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
    const medias = this.mediaRefs?.toArray().map(r => r.nativeElement) || [];
    const bars = this.barRefs?.toArray().map(r => r.nativeElement) || [];
    const texts = this.textRefs?.toArray().map(r => r.nativeElement) || [];

    this.tl?.kill();
    const dur = animate && !this.prefersReduced ? this.duration : 0;
    const tl = gsap.timeline();

    panels.forEach((panel, i) => {
      const isActive = i === this.active;
      const media = medias[i];
      const bar = bars[i];
      const text = texts[i];

      const rot = isActive ? 0 : i < this.active ? this.tilt : -this.tilt;
      const rotProp = this.vertical ? { rotateX: -rot } : { rotateY: rot };

      tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease: this.ease }, 0);

      if (media) {
        const drift = Math.max(-1.5, Math.min(1.5, this.active - i));
        const shift = drift * this.parallax * this.mediaSize * 0.06;
        const gray = this.grayscale ? (isActive ? 0 : 1) : 0;

        tl.to(
          media,
          {
            xPercent: -50,
            yPercent: -50,
            x: this.vertical ? 0 : isActive ? 0 : shift,
            y: this.vertical ? (isActive ? 0 : shift) : 0,
            '--ag-gray': gray,
            '--ag-dim': isActive ? 0 : 0.35,
            duration: dur,
            ease: this.ease
          },
          0
        );
      }

      if (this.showLabels && bar && text) {
        if (isActive) {
          tl.to(
            [bar, text],
            { opacity: 1, x: 0, duration: dur, ease: this.ease, stagger: this.prefersReduced ? 0 : this.stagger },
            0
          );
        } else {
          tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease: this.ease }, 0);
        }
      }
    });

    this.tl = tl;
  }

  setActive(i: number): void {
    if (this.active !== i) {
      this.active = i;
      this.applyLayout(true);
    }
  }

  handleEnter(i: number): void {
    if (this.trigger === 'hover') {
      this.setActive(i);
    }
  }

  handleClick(i: number, e: MouseEvent): void {
    if (i !== this.active) {
      e.preventDefault();
      this.setActive(i);
    }
  }

  handleKeyDown(i: number, e: KeyboardEvent): void {
    const count = this.items.length;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.setActive((i - 1 + count) % count);
    }
  }
}