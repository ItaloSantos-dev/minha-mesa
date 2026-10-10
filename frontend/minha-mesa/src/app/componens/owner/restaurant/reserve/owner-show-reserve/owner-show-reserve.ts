import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReserveStatus } from '../../../../../types/enums/reserve-status';
import { ReserveResponseDTO } from '../../../../../types/reserve/reserve-response';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { DayOfWeek } from '../../../../../types/enums/day-of-week';
import { gsap } from 'gsap/gsap-core';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { ReserveService } from '../../../../../service/reserve-service/reserve-service';
interface StringAndStatus{
  value:string,
  status:ReserveStatus
}
@Component({
  selector: 'app-owner-show-reserve',
  imports: [RouterLink],
  templateUrl: './owner-show-reserve.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowReserve {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private reserveMock:ReserveResponseDTO = {
        id: 1,
        clientName: "Carice freire",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-09-04",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
  }
  readonly reserve = signal<ReserveResponseDTO | null>(null);
  statusForUpdated = signal(<ReserveStatus>{});

  private utilityService = inject(UtilityService);
  private reserveService = inject(ReserveService);

  private restaurantService = inject(RestaurantService);

  getStatusAvaliableForUpdated(): StringAndStatus[] {
    if (!this.reserve()) {
      return [];
    }

    const reserve = this.reserve()!;
    const today = new Date();
    const reserveDate = new Date(`${reserve.date}T00:00:00`);

    const isTodayOrPast = reserveDate <= today;
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

        if (isAfterTomorrow) {
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

        return statuses;
      }

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

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(1);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.restaurantService.getReserveOfRestaurantById(Number(id)).subscribe({
        next: (data) =>{
          this.reserve.set(data);
          this.statusForUpdated.set(this.reserve()?.status as ReserveStatus);
        },error: (err) =>{
          console.log(err);
        }
      })
    }    

  }

  ngOnUpdateStatusOfReserve(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reserveService.updatStatusOfReserveById(Number(id), this.statusForUpdated()).subscribe({
         next:async (data) =>{
          await this.router.navigate(['/']);
          await this.router.navigate(['/owner', 'restaurant', 'reservations', id])
        },error: (err) =>{
          console.log(err);
        }
      })
    }
  }

}
