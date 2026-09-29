import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReserveStatus } from '../../../../../types/enums/reserve-status';
import { ReserveResponseDTO } from '../../../../../types/reserve/reserve-response';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';

@Component({
  selector: 'app-owner-show-reserve',
  imports: [RouterLink],
  templateUrl: './owner-show-reserves.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowReserve {
  private utilityService = inject(UtilityService);

  private restaurantService = inject(RestaurantService);

  reserves = signal(<ReserveResponseDTO[]>{});

  readonly reservesMock:ReserveResponseDTO[] = [
    {
        id: 1,
        clientName: "Carice freire",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-09-04",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.CANCELED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 2,
        clientName: "Carice freire",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-02",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 3,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-09",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 4,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-16",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 5,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-23",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 6,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-10-30",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 7,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-06",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 8,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-13",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 9,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-20",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    },
    {
        id: 9,
        clientName: "italo",
        restaurantName: "Restaurante molho sem água",
        tableNumber: 1,
        date: "2026-11-20",
        dayOfWeek: "FRIDAY",
        timeStart: "14:00:00",
        timeEnd: "15:00:00",
        status: ReserveStatus.SCHEDULED,
        observation: "Meu filho autista irá me acompanhar",
        peoples: 2
    }
  ];

  readonly reservesCleanMock:ReserveResponseDTO[] = [];

  readonly currentPage = signal(0);
  readonly pageSize = signal(0);
  readonly searchTerm = signal('');
  readonly selectedStatus = signal('ALL');

  readonly filteredReserves = computed(() => {
    const search = this.searchTerm().trim().toLocaleLowerCase();
    const status = this.selectedStatus();

    return this.reserves().filter((reserve) => {
      const matchesSearch = !search || reserve.clientName.toLocaleLowerCase().includes(search);
      const matchesStatus = status === 'ALL' || reserve.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  readonly totalPages = signal(0);

  readonly paginatedReserves = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    console.log(start);
    
    return this.filteredReserves().slice(start, start + this.pageSize());
  });

  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));

  setSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  setStatus(value: string) {
    this.selectedStatus.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    this.currentPage.set(Math.min(Math.max(page, 1), this.totalPages()));
  }

  getStatusLabel(status: ReserveStatus) {
    const labels: Record<ReserveStatus, string> = {
      [ReserveStatus.SCHEDULED]: 'Agendada',
      [ReserveStatus.CONFIRMED]: 'Confirmada',
      [ReserveStatus.CANCELED]: 'Cancelada',
      [ReserveStatus.COMPLETED]: 'Concluída',
      [ReserveStatus.NO_SHOW]: 'Não compareceu',
    };

    return labels[status];
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

  updatePageValues(){
    const reservesCount = this.reserves().length;
    this.pageSize.set(reservesCount);
    this.currentPage.set(1)
    const haveMoreReserves = this.reserves().length===10;
    this.totalPages.set(haveMoreReserves? this.currentPage()+1 : this.currentPage())
    
  }
  
  loadReserves(page:number){
    this.restaurantService.getReservesOfRestaurant(page-1).subscribe({
      next: (date) =>{
        this.reserves.set(date);
        this.updatePageValues()
      },error: (err) =>{
        console.log(err);
      }
    })
  }

  ngOnInit(){
    this.utilityService.updateCurrentPageOfOwnerMenu(1);
    this.loadReserves(1);
  }

}
