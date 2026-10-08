import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { ScheduleExceptionResponseDTO } from '../../../../../types/schedule_exception/schedule-exception-response';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';

type ExceptionDateStatus = 'past' | 'today' | 'upcoming' | 'invalid';

@Component({
  selector: 'app-owner-show-schedules-exception',
  imports: [],
  templateUrl: './owner-show-schedules-exception.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowSchedulesException {
  private readonly utilityService = inject(UtilityService);
  private readonly restaurantService = inject(RestaurantService);

  readonly scheduleExceptionsMock: ScheduleExceptionResponseDTO[] = [
    { id: 1, date: '2026-10-02', reason: 'Manutenção da cozinha' },
    { id: 2, date: '2026-10-07', reason: 'Evento privado no restaurante' },
    { id: 3, date: '2026-10-12', reason: 'Feriado nacional' },
    { id: 4, date: '2026-11-02', reason: 'Reforma do salão' },
    { id: 5, date: '2026-12-25', reason: 'Recesso de Natal' },
  ];

  readonly scheduleExceptions = signal(<ScheduleExceptionResponseDTO[]>[]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);

  updatePageValues(next:boolean){
    const schedulesCount = this.scheduleExceptions().length;
    const haveMoreSchedules = this.scheduleExceptions().length===10;
    this.currentPage.set(next? this.currentPage()+1 : this.currentPage()-1);
    this.totalPages.set(haveMoreSchedules? this.currentPage()+1 : this.currentPage());
  }

  loadScheduleExceptions(page: number, next:boolean) {
    const realPage = page>0 ? page-1 : page; 
    this.restaurantService.getScheduleExceptionsOfRestaurant(realPage).subscribe({
      next:(data) =>{
        this.scheduleExceptions.set(data);
        this.updatePageValues(next);
      },error: (err) =>{
        console.log(err);
      }
    })
    
  }

  getDayOfWeek(dateValue: string): string {
    const date = this.parseLocalDate(dateValue);
    if (!date) return 'Data inválida';

    const weekdays = [
      'domingo',
      'segunda-feira',
      'terça-feira',
      'quarta-feira',
      'quinta-feira',
      'sexta-feira',
      'sábado',
    ];

    return weekdays[date.getDay()];
  }

  formatExceptionDate(dateValue: string): string {
    const date = this.parseLocalDate(dateValue);
    if (!date) return dateValue;

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  getDateStatus(dateValue: string): ExceptionDateStatus {
    const exceptionDate = this.parseLocalDate(dateValue);
    if (!exceptionDate) return 'invalid';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (exceptionDate.getTime() < today.getTime()) return 'past';
    if (exceptionDate.getTime() === today.getTime()) return 'today';
    return 'upcoming';
  }

  getDateStatusLabel(dateValue: string): string {
    const labels: Record<ExceptionDateStatus, string> = {
      past: 'Já passou',
      today: 'Hoje',
      upcoming: 'Futura',
      invalid: 'Data inválida',
    };

    return labels[this.getDateStatus(dateValue)];
  }

  getDateStatusClass(dateValue: string): string {
    const classes: Record<ExceptionDateStatus, string> = {
      past: 'bg-[color-mix(in_srgb,var(--color-coffee)_10%,white)] text-[color-mix(in_srgb,var(--color-coffee)_70%,transparent)]',
      today: 'bg-[color-mix(in_srgb,var(--color-highlight)_24%,white)] text-[#795b00]',
      upcoming: 'bg-[color-mix(in_srgb,var(--color-secondary)_12%,white)] text-(--color-secondary)',
      invalid: 'bg-[#fde5e2] text-[#a23b31]',
    };

    return classes[this.getDateStatus(dateValue)];
  }

  ngOnInit() {
    this.utilityService.updateCurrentPageOfOwnerMenu(4);
    this.loadScheduleExceptions(1, true);
  }

  private parseLocalDate(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }

    return date;
  }

}
