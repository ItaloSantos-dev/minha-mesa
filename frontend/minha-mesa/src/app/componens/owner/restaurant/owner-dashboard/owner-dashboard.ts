import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { OwnerDashboardCard } from './owner-dashboard-card/owner-dashboard-card';
import { DashboardResponseDTO } from '../../../../types/restaurant/dashboard/dashboard-response';
import { ReserveStatus } from '../../../../types/enums/reserve-status';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { MessageError } from '../../../message-error/message-error';
import { NotFound } from '../../../not-found/not-found';

interface Card{
  icon:string;
  title:string;
  value:number;
  accent:string
}
@Component({
  selector: 'app-owner-dashboard',
  imports: [OwnerDashboardCard, MessageError],
  templateUrl: './owner-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerDashboard {
  dashboardResponseMock: DashboardResponseDTO = {
    restaurantName:'Sonho na cozinha',
    totalReservations: 25,
    scheduledReservations: 10,
    confirmedReservations: 12,
    peoplesExpectedInDay: 38,

    nextReservations: [
      {
        id: 1,
        clientName: 'João Silva',
        restaurantName: 'Minha Mesa',
        tableNumber: 1,
        date: '2026-09-24',
        dayOfWeek: 'THURSDAY',
        timeStart: '18:00',
        timeEnd: '19:30',
        status: ReserveStatus.CONFIRMED,
        observation: 'Mesa próxima à janela',
        peoples: 4
      },
      {
        id: 2,
        clientName: 'Maria Santos',
        restaurantName: 'Minha Mesa',
        tableNumber: 1,
        date: '2026-09-24',
        dayOfWeek: 'THURSDAY',
        timeStart: '20:00',
        timeEnd: '21:30',
        status: ReserveStatus.SCHEDULED,
        observation: '',
        peoples: 2
      }
    ],

    tablesTotalCount: 15,
    tablesActiveCount: 12,

    realTimeTablesData: {
      tablesOccupied: 5,
      tablesFree: 7,
      dataAndTimeFetchedAt: '2026-09-24T20:19:35.899157761-03:00'
    },
    dateOfDashboard:'2026-09-24'
  };
  dashboardRestaurant = signal<DashboardResponseDTO>({
    restaurantName: '',
    totalReservations: 0,
    scheduledReservations: 0,
    confirmedReservations: 0,
    peoplesExpectedInDay: 0,
    nextReservations: [],
    tablesTotalCount: 0,
    tablesActiveCount: 0,
    realTimeTablesData: {
      tablesOccupied: 0,
      tablesFree: 0,
      dataAndTimeFetchedAt: '',
    },
    dateOfDashboard: '',
  });
  private utilityService = inject(UtilityService);
  private restaurantService = inject(RestaurantService);
  private exceptionService = inject(ExceptionService);

  metrics:Card[] = [
    { icon: 'bi bi-calendar3', title: 'Reservas totais', value: 0, accent: 'primary' },
    { icon: 'bi bi-clock', title: 'Aguardando confirmação', value: 0, accent: 'highlight' },
    { icon: 'bi bi-check-circle', title: 'Reservas confirmadas', value: 0, accent: 'secondary' },
    { icon: 'bi bi-people-fill', title: 'Pessoas esperadas', value: 0, accent: 'coffee' },
  ];

  completedCards(){
    this.metrics[0].value = this.dashboardRestaurant().totalReservations;
    this.metrics[1].value = this.dashboardRestaurant().scheduledReservations;
    this.metrics[2].value = this.dashboardRestaurant().confirmedReservations;
    this.metrics[3].value = this.dashboardRestaurant().peoplesExpectedInDay;
  }

  getStatusReserve(reserveStatus:ReserveStatus){
    switch (reserveStatus) {
      case ReserveStatus.SCHEDULED:
        return "AGENDADA"
        break;
      case ReserveStatus.CONFIRMED:
        return "CONFIRMADA"
        break;
      default:
        return "CONFIRMADA"
    }
  }

  getPercentageOfTablesOccupied(){
    const activeTables = this.dashboardRestaurant().tablesActiveCount;
    if (activeTables === 0) return '0';

    return ((this.dashboardRestaurant().realTimeTablesData.tablesOccupied / activeTables) * 100).toFixed(0)
  }

  timeOfFetchedDashboardRequest = computed(() => {
    const fetchedAt = this.dashboardRestaurant().realTimeTablesData.dataAndTimeFetchedAt;
    return fetchedAt ? fetchedAt.split('T')[1]?.slice(0, 5) ?? '--:--' : '--:--';
  });

  

  readonly occupancy = [
    { label: 'Mesas ocupadas', value: '08', percentage: 66, color: 'var(--color-primary)' },
    { label: 'Mesas livres', value: '04', percentage: 34, color: 'var(--color-secondary)' },
  ];

  dataAtual = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  private LASTFETCHEDGETDASHBOARDTOKEN = 'lastFetchedGetDashboard';

  private handlerShowError(error: HttpErrorResponse) {
    if (this.exceptionService.handlerRedirectExceptionResponse(error, NotFound.pathsOfApplication.OWNER_DASHBOARD)) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
    }
  }

  fetchDashboard(){
    this.restaurantService.getDashboard().subscribe({
      next:(dado) =>{
        console.log(dado);
        
        this.dashboardRestaurant.set(dado)
        localStorage.setItem('this.LASTFETCHEDGETDASHBOARDTOKEN', this.dashboardRestaurant().realTimeTablesData.dataAndTimeFetchedAt)
        this.completedCards();
      },
      error: (error: HttpErrorResponse) =>{
        this.handlerShowError(error);
      }
    })
        
  }

  ngOnInit(){
    const lastFetchedGetDashboard = localStorage.getItem(this.LASTFETCHEDGETDASHBOARDTOKEN);
    this.utilityService.updateCurrentPageOfOwnerMenu(0);
    if (lastFetchedGetDashboard){     
      const dateTimeOflastFetchedGetDashboard = new Date(lastFetchedGetDashboard);
      const FIVE_MINUTES = 5 * 60 * 1000
      const passedFiveMinutes = (Date.now() - dateTimeOflastFetchedGetDashboard.getTime()) >= FIVE_MINUTES;
      if (passedFiveMinutes) {
        this.fetchDashboard()
      }
    }
    else{
      this.fetchDashboard()
    }
  }
}
