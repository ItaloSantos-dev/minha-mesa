import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, output, signal, ViewChild } from '@angular/core';
import { OwnerCreateScheduleException } from '../owner-create-schedule-exception/owner-create-schedule-exception';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { ScheduleExceptionResponseDTO } from '../../../../../types/schedule_exception/schedule-exception-response';
import { CreateScheduleExceptionRequestDTO } from '../../../../../types/schedule_exception/create-schedule-exception-request';
import { gsap } from 'gsap/gsap-core';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { ScheduleExceptionService } from '../../../../../service/schedule-exception-service/schedule-exception-service';

type ExceptionDateStatus = 'past' | 'today' | 'upcoming' | 'invalid';

@Component({
  selector: 'app-owner-show-schedules-exception',
  imports: [OwnerCreateScheduleException],
  templateUrl: './owner-show-schedules-exception.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowSchedulesException {
  private readonly utilityService = inject(UtilityService);
  readonly isCreateFormOpen = signal(false);
  private readonly scheduleExceptionService = inject(ScheduleExceptionService);


  @ViewChild('createScheduleException', { read: ElementRef })
  createScheduleException!: ElementRef<HTMLElement>;
  @ViewChild('statusConfirmationOverlay', { read: ElementRef })
  statusConfirmationOverlay!: ElementRef<HTMLElement>;
  private readonly restaurantService = inject(RestaurantService);

  readonly scheduleExceptionsMock: ScheduleExceptionResponseDTO[] = [
    { id: 1, date: '2026-10-02', reason: 'Manutenção da cozinha', active: true },
    { id: 2, date: '2026-10-07', reason: 'Evento privado no restaurante', active: true },
    { id: 3, date: '2026-10-12', reason: 'Feriado nacional', active: true },
    { id: 4, date: '2026-11-02', reason: 'Reforma do salão', active: true },
    { id: 5, date: '2026-12-25', reason: 'Recesso de Natal', active: false },
  ];

  readonly scheduleExceptions = signal(<ScheduleExceptionResponseDTO[]>[]);
  readonly selectedExceptionForStatusChange = signal<ScheduleExceptionResponseDTO | null>(null);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);

  handlerShowCreateForm(created: boolean) {
    const overlay = this.createScheduleException.nativeElement;
    this.isCreateFormOpen.set(!this.isCreateFormOpen());

    if (this.isCreateFormOpen()) {
      gsap.set(overlay, { display: 'flex' });
      gsap.to(overlay, { opacity: 1, duration: 0.3 });
    }
    else{
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      });
      if (created) {
        this.loadScheduleExceptions(1, false);
      }
    }

    
  }

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

  handlerShowStatusConfirmation(exceptionId: number) {
    const exception = this.scheduleExceptions().find((item) => item.id === exceptionId);
    if (!exception || !this.canChangeExceptionStatus(exception.date)) return;

    this.selectedExceptionForStatusChange.set(exception);
    const overlay = this.statusConfirmationOverlay.nativeElement;
    gsap.set(overlay, { display: 'flex' });
    gsap.to(overlay, { opacity: 1, duration: 0.3 });
  }

  handlerCloseStatusConfirmation() {
    const overlay = this.statusConfirmationOverlay.nativeElement;
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(overlay, { display: 'none' });
        this.selectedExceptionForStatusChange.set(null);
      },
    });
  }

  confirmExceptionStatusChange() {
    const id = this.selectedExceptionForStatusChange()?.id;

    if (id === undefined) {
      return;
    }
    this.scheduleExceptionService.updateStatusScheduleExceptionById(id).subscribe({
      next:() =>{
        this.loadScheduleExceptions(1, false);
        this.handlerCloseStatusConfirmation();
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

  canChangeExceptionStatus(dateValue: string): boolean {
    const dateStatus = this.getDateStatus(dateValue);
    return dateStatus === 'today' || dateStatus === 'upcoming';
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
