import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { ReserveFactory } from '../../../../../factory/reserve.factory';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReserveStatus } from '../../../../../types/enums/reserve-status';
import { ReserveResponseDTO } from '../../../../../types/reserve/reserve-response';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { DayOfWeek } from '../../../../../types/enums/day-of-week';
import { gsap } from 'gsap/gsap-core';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { ReserveService } from '../../../../../service/reserve-service/reserve-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { ExceptionResponse } from '../../../../../types/exception/excpetion-response';
import { MessageError } from '../../../../message-error/message-error';
import { NotFound } from '../../../../not-found/not-found';
import { DishesOfRestauranteResponseDTO } from '../../../../../types/dish/dishes-of-restaurant-response';
import { DishResponseDTO } from '../../../../../types/dish/dish-repsonse';
import { CreateReserveDishRequestDTO } from '../../../../../types/reserve_dish/create-reserve-dish-request';
import { ReserveDishResponseDTO } from '../../../../../types/reserve_dish/reserve-dish-response';
import { ReserveDishStatus } from '../../../../../types/enums/reserve-dish-status';
import { ReserveDishService } from '../../../../../service/reserve-dish-service/reserve-dish-service';
import { OwnerReserveDish } from '../owner-reserve-dish/owner-reserve-dish';
import { ReserveAddDish } from '../reserve-add-dish/reserve-add-dish';
interface StringAndStatus{
  value:string,
  status:ReserveStatus
}
@Component({
  selector: 'app-owner-show-reserve',
  imports: [RouterLink, MessageError, OwnerReserveDish, ReserveAddDish],
  templateUrl: './owner-show-reserve.html',
  styleUrl: './owner-show-reserve.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowReserve implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private utilityService = inject(UtilityService);
  private exceptioNService = inject(ExceptionService);

  private reserveMock:ReserveResponseDTO = ReserveFactory.createMock();
  readonly reserve = signal<ReserveResponseDTO | null>(null);
  statusForUpdated = signal(<ReserveStatus>{});

  private reserveService = inject(ReserveService);

  private restaurantService = inject(RestaurantService);
  private reserveDishService = inject(ReserveDishService);
  readonly loading = signal(true);
  readonly loadingDishes = signal(false);
  readonly availableDishes = signal<DishResponseDTO[]>([]);
  readonly showAddDishDialog = signal(false);
  readonly isAddingDish = signal(false);
  readonly hasDishOverflow = signal(false);
  readonly canScrollDishPrevious = signal(false);
  readonly canScrollDishNext = signal(false);
  readonly reserveStatus = ReserveStatus;
  readonly showPastReservationNoShowWarning = computed(() => {
    const reserve = this.reserve();
    if (
      !reserve ||
      reserve.status === ReserveStatus.CANCELED ||
      reserve.status === ReserveStatus.COMPLETED ||
      reserve.status === ReserveStatus.NO_SHOW
    ) {
      return false;
    }

    const [year, month, day] = reserve.date.split('-').map(Number);
    const reservationDate = new Date(year, month - 1, day);
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return reservationDate < todayDate;
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

  readonly selectableDishes = computed(() => {
    const addedDishIds = new Set(this.reserve()?.reserveDishes.map((dish) => dish.dishId) ?? []);
    return this.availableDishes().filter((dish) => !addedDishIds.has(dish.id));
  });
  openAddDishDialog() {
    if (this.reserve()?.status !== ReserveStatus.IN_PROGRESS || this.selectableDishes().length === 0) {
      return;
    }
    this.showAddDishDialog.set(true);
  }

  closeAddDishDialog() {
    if (!this.isAddingDish()) {
      this.showAddDishDialog.set(false);
    }
  }

  addDish(dishSelection: { dishId: number; quantity: number }) {
    const reserve = this.reserve();

    if (
      reserve?.status !== ReserveStatus.IN_PROGRESS ||
      !this.selectableDishes().some((dish) => dish.id === dishSelection.dishId && dish.active) ||
      !Number.isInteger(dishSelection.quantity) ||
      dishSelection.quantity < 1 ||
      this.isAddingDish()
    ) {
      return;
    }

    const request: CreateReserveDishRequestDTO = {
      reserveId: reserve.id,
      dishId: dishSelection.dishId,
      quantity: dishSelection.quantity,
    };

    this.isAddingDish.set(true);
    this.reserveDishService.createReserveDish(request).subscribe({
      next: (reserveDish) => {
        this.reserve.update((current) =>
          current ? { ...current, reserveDishes: [...current.reserveDishes, reserveDish] } : current,
        );
        this.showAddDishDialog.set(false);
        this.isAddingDish.set(false);
        requestAnimationFrame(() => this.updateDishCarousel());
      },
      error: (error: HttpErrorResponse) => {
        this.handlerShowError(error);
        this.isAddingDish.set(false);
      },
    });
  }

  updateReserveDish(updatedDish: ReserveDishResponseDTO) {
    this.reserve.update((current) =>
      current
        ? {
            ...current,
            reserveDishes: current.reserveDishes.map((dish) =>
              dish.id === updatedDish.id ? updatedDish : dish,
            ),
          }
        : current,
    );
    requestAnimationFrame(() => this.updateDishCarousel());
  }

  moveDishCarousel(direction: -1 | 1) {
    const viewport = this.dishesViewport;
    viewport?.scrollBy({
      left: direction * (viewport.clientWidth * 0.8),
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

  ngOnDestroy() {
    this.dishesResizeObserver?.disconnect();
  }

  getStatusAvaliableForUpdated(): StringAndStatus[] {
    if (!this.reserve()) {
      return [];
    }

    const reserve = this.reserve()!;
    const today = new Date();
    const reserveDate = new Date(`${reserve.date}T00:00:00`);
    const now = new Date();
    const reserveStart = new Date(`${reserve.date}T${reserve.timeStart}`);
    const reserveEnd = new Date(`${reserve.date}T${reserve.timeEnd}`);

    const isTodayOrPast = reserveDate <= today;
    const isPast = reserveDate < today;
    const isWithinReserveTime = now >= reserveStart && now <= reserveEnd;
    const isAfterTomorrow = reserveDate > new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    switch (reserve.status) {
      case ReserveStatus.SCHEDULED: {
        const statuses: StringAndStatus[] = [
          {
            value: 'Confirmada',
            status: ReserveStatus.CONFIRMED
          }
        ];

        if (isAfterTomorrow || isPast) {
          statuses.push({
            value: 'Cancelada',
            status: ReserveStatus.CANCELED
          });
        }

        if (isTodayOrPast) {
          statuses.push({
            value: 'Concluída',
            status: ReserveStatus.COMPLETED
          });
        }

        return statuses;
      }

      case ReserveStatus.CONFIRMED: {
        const statuses: StringAndStatus[] = [];

        if (isAfterTomorrow) {
          statuses.push({
            value: 'Cancelada',
            status: ReserveStatus.CANCELED
          });
        }

        if (isTodayOrPast) {
          statuses.push(
            {
              value: 'Concluída',
              status: ReserveStatus.COMPLETED
            },
            {
              value: 'Não compareceu',
              status: ReserveStatus.NO_SHOW
            }
          );
        }

        if (isWithinReserveTime) {
          statuses.push({
            value: 'Em andamento',
            status: ReserveStatus.IN_PROGRESS,
          });
        }

        return statuses;
      }

      case ReserveStatus.IN_PROGRESS:
        return isTodayOrPast
          ? [{ value: 'Concluída', status: ReserveStatus.COMPLETED }]
          : [];

      case ReserveStatus.CANCELED:
      case ReserveStatus.COMPLETED:
      case ReserveStatus.NO_SHOW:
        return [];

      default:
        return [];
    }
  }
  

  getStatusClass(status: ReserveStatus) {
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

  getDayOfReserve(dayWeek: string): string {
  switch (dayWeek) {
    case DayOfWeek.MONDAY:
      return 'Segunda-Feira';
    case DayOfWeek.TUESDAY:
      return 'Terça-Feira';
    case DayOfWeek.WEDNESDAY:
      return 'Quarta-Feira';
    case DayOfWeek.THURSDAY:
      return 'Quinta-Feira';
    case DayOfWeek.FRIDAY:
      return 'Sexta-Feira';
    case DayOfWeek.SATURDAY:
      return 'Sábado';
    case DayOfWeek.SUNDAY:
      return 'Domingo';
    default:
      return '';
  }
}


  getStatusColor(status: ReserveStatus | string): string {
    let commomClass = 'px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full '
    switch (status) {
      case ReserveStatus.SCHEDULED:
        // Amarelo para agendado (aguardando)
        commomClass += 'bg-yellow-100 text-yellow-800'; 
        break;
      case ReserveStatus.CONFIRMED:
        // Verde para confirmado
        commomClass += 'bg-green-100 text-green-800';
        break;
      case ReserveStatus.CANCELED:
        // Vermelho para cancelado
        commomClass += 'bg-red-100 text-red-800';
        break;
      case ReserveStatus.COMPLETED:
        // Azul para concluído/finalizado
        commomClass += 'bg-blue-100 text-blue-800';
        break;
      case ReserveStatus.NO_SHOW:
        // Laranja para não comparecimento
        commomClass += 'bg-orange-100 text-orange-800';
        break;
      case ReserveStatus.IN_PROGRESS:
        // Roxo para reserva em andamento
        commomClass += 'bg-purple-100 text-purple-800';
        break;
      default:
        // Cinza padrão
        commomClass += 'bg-gray-100 text-gray-800';
    }

    return commomClass;
  }

  getStatusLabel(status: ReserveStatus): string {
  switch (status) {
    case ReserveStatus.SCHEDULED:
      return 'Agendada';

    case ReserveStatus.CONFIRMED:
      return 'Confirmada';

    case ReserveStatus.IN_PROGRESS:
      return 'Em andamento';

    case ReserveStatus.CANCELED:
      return 'Cancelada';

    case ReserveStatus.COMPLETED:
      return 'Concluída';

    case ReserveStatus.NO_SHOW:
      return 'Não compareceu';
    
    default:
      return 'Desconhecido';
  }
}

  @ViewChild('overlayConfirmation')
  overlayConfirmationDiv!: ElementRef<HTMLElement>

  showConfirmedUpdatedStatus = signal(false)
  
  handlerShowConfirmedUpdatedStatus(){
    const shouldShow = !this.showConfirmedUpdatedStatus();
    this.showConfirmedUpdatedStatus.set(shouldShow);

    const overlayConfirmation = this.overlayConfirmationDiv.nativeElement;

    if (shouldShow) {
      gsap.set(overlayConfirmation, {
        display: 'flex'
      });

      gsap.to(overlayConfirmation, {
        opacity: 1,
        duration: 0.3
      });
    } else {
      gsap.to(overlayConfirmation, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(overlayConfirmation, {
            display: 'none'
          });
        }
      });
    }
  }

  
  reserveFinished = computed (() => this.reserve()?.status===ReserveStatus.CANCELED ||
    this.reserve()?.status===ReserveStatus.COMPLETED ||
    this.reserve()?.status===ReserveStatus.NO_SHOW);

  statusHasUpdated = computed( () => this.reserve()?.status!==this.statusForUpdated())

  handlerUpdatedStatus(status:ReserveStatus){
    console.log(status);
    
    this.statusForUpdated.set(status);
  }

  handlerShowError(erro:HttpErrorResponse){
    const showError = this.exceptioNService.handlerRedirectExceptionResponse(
      erro,
      UtilityService.pathsOfApplication.OWNER_SHOW_RESERVES,
    );
    if (showError) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(erro));
    }
  }

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(UtilityService.ownerMenuPosition.RESERVES);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.restaurantService.getReserveOfRestaurantById(Number(id)).subscribe({
        next: (data) =>{
          this.reserve.set(data);
          this.statusForUpdated.set(this.reserve()?.status as ReserveStatus);
          this.loading.set(false);
          if (data.status === ReserveStatus.IN_PROGRESS) {
            this.loadAvailableDishes();
          }
        },
        error: (erro:HttpErrorResponse) =>{
          this.loading.set(false);
          const showForm = this.exceptioNService.handlerRedirectExceptionResponse(erro, UtilityService.pathsOfApplication.OWNER_SHOW_RESERVES);
          if (showForm) {
            this.handlerShowError(erro)
          }
        }
      })
    }    

  }

  private loadAvailableDishes() {
    this.loadingDishes.set(true);
    this.restaurantService.getDishesOfOwnerRestaurant().subscribe({
      next: (data: DishesOfRestauranteResponseDTO) => {
        const dishes = [
          ...data.categories.flatMap((category) => category.dishes),
          ...data.dishesWithoutCategories,
        ];
        this.availableDishes.set(dishes.filter((dish) => dish.active));
        this.loadingDishes.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.loadingDishes.set(false);
        this.handlerShowError(error);
      },
    });
  }

  ngOnUpdateStatusOfReserve(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reserveService.updatStatusOfReserveById(Number(id), this.statusForUpdated()).subscribe({
         next:async (data) =>{
          await this.router.navigate(['/']);
          await this.router.navigate(['/owner', 'restaurant', 'reservations', id])
        },error: (erro:HttpErrorResponse) =>{
          const showForm = this.exceptioNService.handlerRedirectExceptionResponse(erro, UtilityService.pathsOfApplication.OWNER_SHOW_RESERVES);
          if (showForm) {
            this.handlerShowError(erro)
          }
        }
      })
    }
  }

}
