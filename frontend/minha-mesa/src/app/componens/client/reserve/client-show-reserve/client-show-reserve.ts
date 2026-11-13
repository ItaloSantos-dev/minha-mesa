import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';


import { OwnerReserveDishCard } from '../owner-reserve-dish-card/owner-reserve-dish-card';
import { MessageError } from '../../../message-error/message-error';
import { UserService } from '../../../../service/user-service/user-service';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { ReserveResponseDTO } from '../../../../types/reserve/reserve-response';
import { ReserveDishResponseDTO } from '../../../../types/reserve_dish/reserve-dish-response';
import { CreateRateDishRequestDTO } from '../../../../types/rate_dish/create-rate-dish-request';
import { RateDishService } from '../../../../service/rate-service/rate-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { ReserveStatus } from '../../../../types/enums/reserve-status';

@Component({
  selector: 'app-client-show-reserve',
  imports: [MessageError, OwnerReserveDishCard, RouterLink],
  templateUrl: './client-show-reserve.html',
  styleUrl: './client-show-reserve.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientShowReserve implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly rateDishService = inject(RateDishService)
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);

  readonly reserve = signal<ReserveResponseDTO | null>(null);
  readonly loading = signal(true);
  readonly selectedReserveDish = signal<ReserveDishResponseDTO | null>(null);
  readonly rating = signal(0);
  readonly comment = signal('');
  readonly isSubmittingRate = signal(false);
  readonly hasDishOverflow = signal(false);
  readonly canScrollDishPrevious = signal(false);
  readonly canScrollDishNext = signal(false);
  readonly ratingOptions = [1, 2, 3, 4, 5];
  reserveStatus = ReserveStatus
  readonly canRate = computed(() => {
    const status = this.reserve()?.status;
    return status === this.reserveStatus.IN_PROGRESS || status === this.reserveStatus.COMPLETED;
  });
  private dishesResizeObserver?: ResizeObserver;
  private dishesViewport?: HTMLDivElement;

  @ViewChild('dishesViewport')
  set dishesViewportElement(element: ElementRef<HTMLDivElement> | undefined) {
    this.dishesResizeObserver?.disconnect();
    this.dishesViewport = element?.nativeElement;
    if (this.dishesViewport && typeof ResizeObserver !== 'undefined') {
      this.dishesResizeObserver = new ResizeObserver(() => this.updateDishCarousel());
      this.dishesResizeObserver.observe(this.dishesViewport);
    }
    requestAnimationFrame(() => this.updateDishCarousel());
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReserve(Number(id));
    }
  }

  loadReserve(id: number) {
    this.userService.getReserveOfUserById(id).subscribe({
      next: (reserve) => {
        this.reserve.set(reserve);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.handlerShowError(error);
      },
    });
  }

  ngOnDestroy() {
    this.dishesResizeObserver?.disconnect();
  }

  moveDishCarousel(direction: -1 | 1) {
    const viewport = this.dishesViewport;
    viewport?.scrollBy({
      left: direction * (viewport?.clientWidth ?? 0) * 0.8,
      behavior: 'smooth',
    });
  }

  updateDishCarousel() {
    const viewport = this.dishesViewport;
    if (!viewport) {
      this.hasDishOverflow.set(false);
      this.canScrollDishPrevious.set(false);
      this.canScrollDishNext.set(false);
      return;
    }

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    this.hasDishOverflow.set(maxScroll > 2);
    this.canScrollDishPrevious.set(viewport.scrollLeft > 2);
    this.canScrollDishNext.set(viewport.scrollLeft < maxScroll - 2);
  }

  openRateDialog(reserveDish: ReserveDishResponseDTO) {
    if (!this.canRate() || reserveDish.rateDish) {
      return;
    }

    this.selectedReserveDish.set(reserveDish);
    this.rating.set(0);
    this.comment.set('');
  }

  closeRateDialog() {
    if (this.isSubmittingRate()) {
      return;
    }
    this.selectedReserveDish.set(null);
  }

  submitRate(event: SubmitEvent) {
    event.preventDefault();
    const reserveDish = this.selectedReserveDish();
    const rating = this.rating();

    if (
      !reserveDish ||
      !this.canRate() ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      this.isSubmittingRate()
    ) {
      return;
    }

    const request: CreateRateDishRequestDTO = {
      reserveDishId: reserveDish.id,
      rating,
      comment: this.comment().trim() || null,
    };

    this.isSubmittingRate.set(true);
    this.rateDishService.createRateDish(request).subscribe({
      next: (rateDish) => {
        this.reserve.update((reserve) =>
          reserve
            ? {
                ...reserve,
                reserveDishes: reserve.reserveDishes.map((item) =>
                  item.id === reserveDish.id ? { ...item, rateDish } : item,
                ),
              }
            : reserve,
        );
        this.selectedReserveDish.set(null);
        this.isSubmittingRate.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.handlerShowError(error);
        this.isSubmittingRate.set(false);
      },
    });
  }

  handlerShowError(error: HttpErrorResponse) {
    if (
      this.exceptionService.handlerRedirectExceptionResponse(
        error,
        UtilityService.pathsOfApplication.CLIENT_SHOW_RESERVES,
      )
    ) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
    }
  }

  getStatusLabel(status: ReserveStatus): string {
    const labels: Record<ReserveStatus, string> = {
      [ReserveStatus.SCHEDULED]: 'Agendada',
      [ReserveStatus.CONFIRMED]: 'Confirmada',
      [ReserveStatus.IN_PROGRESS]: 'Em andamento',
      [ReserveStatus.CANCELED]: 'Cancelada',
      [ReserveStatus.COMPLETED]: 'Concluída',
      [ReserveStatus.NO_SHOW]: 'Não compareceu',
    };
    return labels[status];
  }

  getStatusClass(status: ReserveStatus): string {
    const classes: Record<ReserveStatus, string> = {
      [ReserveStatus.SCHEDULED]: 'bg-[#fff2c9] text-[#876200]',
      [ReserveStatus.CONFIRMED]: 'bg-[#e1f3e8] text-[#28734a]',
      [ReserveStatus.IN_PROGRESS]: 'bg-[#e3edf5] text-[#236184]',
      [ReserveStatus.CANCELED]: 'bg-[#fde5e2] text-[#a23b31]',
      [ReserveStatus.COMPLETED]: 'bg-[#e3edf5] text-[#236184]',
      [ReserveStatus.NO_SHOW]: 'bg-[#f1e4ef] text-[#82436f]',
    };
    return classes[status];
  }

  formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  getDayLabel(dayOfWeek: string): string {
    const labels: Record<string, string> = {
      MONDAY: 'Segunda-feira',
      TUESDAY: 'Terça-feira',
      WEDNESDAY: 'Quarta-feira',
      THURSDAY: 'Quinta-feira',
      FRIDAY: 'Sexta-feira',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo',
    };
    return labels[dayOfWeek] ?? dayOfWeek;
  }


}
