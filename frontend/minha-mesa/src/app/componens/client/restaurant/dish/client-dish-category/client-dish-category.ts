import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { DishCategoryResponseDTO } from '../../../../../types/dish_category/dish-category-response';
import { ClientCardDish } from '../client-card-dish/client-card-dish';

@Component({
  selector: 'app-client-dish-category',
  imports: [ClientCardDish],
  templateUrl: './client-dish-category.html',
  styleUrl: './client-dish-category.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDishCategory implements AfterViewInit, OnDestroy {
  readonly category = input.required<DishCategoryResponseDTO>();
  readonly carouselEnabled = signal(false);
  readonly visibleSets = computed(() => (this.carouselEnabled() ? [0, 1, 2] : [0]));

  @ViewChild('viewport') private viewport?: ElementRef<HTMLDivElement>;
  @ViewChild('dishSet') private dishSet?: ElementRef<HTMLDivElement>;

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.updateCarousel();
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.updateCarousel());
    if (this.viewport) {
      this.resizeObserver.observe(this.viewport.nativeElement);
    }
    if (this.dishSet) {
      this.resizeObserver.observe(this.dishSet.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  moveCarousel(direction: -1 | 1): void {
    if (!this.carouselEnabled()) {
      return;
    }
    const viewport = this.viewport?.nativeElement;
    if (!viewport) {
      return;
    }
    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.8,
      behavior: 'smooth',
    });
  }

  onCarouselScroll(): void {
    if (!this.carouselEnabled()) {
      return;
    }

    const viewport = this.viewport?.nativeElement;
    const setWidth = this.dishSet?.nativeElement.offsetWidth;
    if (!viewport || !setWidth) {
      return;
    }

    if (viewport.scrollLeft < setWidth * 0.5) {
      viewport.scrollLeft += setWidth;
    } else if (viewport.scrollLeft > setWidth * 1.5) {
      viewport.scrollLeft -= setWidth;
    }
  }

  private updateCarousel(): void {
    const viewport = this.viewport?.nativeElement;
    const set = this.dishSet?.nativeElement;
    if (!viewport || !set) {
      return;
    }

    const shouldEnable = this.category().dishes.length > 1 && set.offsetWidth > viewport.clientWidth;
    if (shouldEnable === this.carouselEnabled()) {
      return;
    }

    this.carouselEnabled.set(shouldEnable);
    if (shouldEnable) {
      requestAnimationFrame(() => {
        const currentViewport = this.viewport?.nativeElement;
        const currentSetWidth = this.dishSet?.nativeElement.offsetWidth;
        if (currentViewport && currentSetWidth && this.carouselEnabled()) {
          currentViewport.scrollLeft = currentSetWidth;
        }
      });
    } else {
      viewport.scrollLeft = 0;
    }
  }
}
