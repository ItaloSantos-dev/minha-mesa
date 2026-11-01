import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, ElementRef, inject, input, output, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { gsap } from 'gsap/gsap-core';
import { ExceptionService } from '../../../../service/exception-service/exception-service';
import { ReserveService } from '../../../../service/reserve-service/reserve-service';
import { TableService } from '../../../../service/table-service/table-service';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { ExceptionResponse } from '../../../../types/exception/excpetion-response';
import { mapDayNumber } from '../../../../types/enums/day-of-week';
import { CreateReserveRequestDTO } from '../../../../types/reserve/create-reserve-request';
import { RestaurantResponseDTO } from '../../../../types/restaurant/restaurant-response';
import { TableResponseDTO } from '../../../../types/table/table-response';
import { WorkingScheduleResponseDTO } from '../../../../types/working_schedule/working-schedule-response';
import { MessageError } from '../../../message-error/message-error';

const validTimeRange: ValidatorFn = (control) => {
  const timeStart = control.get('timeStart')?.value as string | null;
  const timeEnd = control.get('timeEnd')?.value as string | null;

  if (!timeStart || !timeEnd) return null;
  return timeStart < timeEnd ? null : { invalidTimeRange: true };
};

const validReserveDate: ValidatorFn = (control) => {
  const value = control.value as string | null;
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);
  const selectedDate = new Date(year, month - 1, day);
  if (
    Number.isNaN(selectedDate.getTime())
    || selectedDate.getFullYear() !== year
    || selectedDate.getMonth() !== month - 1
    || selectedDate.getDate() !== day
  ) {
    return { invalidReserveDate: true };
  }

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return selectedDate <= tomorrow ? { invalidReserveDate: true } : null;
};

@Component({
  selector: 'app-client-create-reserve',
  imports: [ReactiveFormsModule, MessageError],
  templateUrl: './client-create-reserve.html',
  styleUrl: './client-create-reserve.css',
})
export class ClientCreateReserve {
  readonly restaurant = input<RestaurantResponseDTO | null>(null);
  readonly closed = output<void>();
  readonly tablesAvaliables = signal<TableResponseDTO[]>([]);
  readonly hasSearchedTables = signal(false);
  readonly isSearchingTables = signal(false);
  readonly isSubmitting = signal(false);
  readonly reservationCreated = signal(false);
  readonly minDate = this.getMinimumDate();


  readonly form = new FormGroup({
    tableId: new FormControl<number | null>(null, Validators.required),
    workingScheduleId: new FormControl<number | null>(null, Validators.required),
    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, validReserveDate],
    }),
    timeStart: new FormControl('', { nonNullable: true, validators: Validators.required }),
    timeEnd: new FormControl('', { nonNullable: true, validators: Validators.required }),
    peoples: new FormControl(2, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    observation: new FormControl('', { nonNullable: true }),
  }, { validators: validTimeRange });

  private readonly tableService = inject(TableService);
  private readonly reserveService = inject(ReserveService);
  private readonly exceptionService = inject(ExceptionService);
  private readonly utilityService = inject(UtilityService);
  private readonly destroyRef = inject(DestroyRef);
  private tableSearchRequestId = 0;
  private isClosing = false;

  @ViewChild('overlay')
  private overlay!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    gsap.set(this.overlay.nativeElement, { display: 'flex', opacity: 0 });
    gsap.to(this.overlay.nativeElement, { opacity: 1, duration: 0.3 });
  }

  close(): void {
    if (this.isClosing) return;
    this.isClosing = true;

    gsap.to(this.overlay.nativeElement, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.set(this.overlay.nativeElement, { display: 'none' });
        this.closed.emit();
      },
    });
  }

  
  canSearchTables(): boolean {
    return this.form.controls.date.valid
      && this.form.controls.workingScheduleId.valid
      && this.form.controls.timeStart.valid
      && this.form.controls.timeEnd.valid
      && this.form.controls.peoples.valid
      && !this.form.hasError('invalidTimeRange');
  }

  clearAvailableTables(): void {
    this.tableSearchRequestId++;
    this.isSearchingTables.set(false);
    this.tablesAvaliables.set([]);
    this.hasSearchedTables.set(false);
    this.form.controls.tableId.reset();
  }

  onDateChange(): void {
    this.form.patchValue({ workingScheduleId: null, timeStart: '', timeEnd: '' });
    this.clearAvailableTables();
  }

  selectWorkingSchedule(): void {
    const schedule = this.availableSchedules().find(
      item => item.id === this.form.controls.workingScheduleId.value,
    );
    this.form.patchValue({
      timeStart: schedule?.timeStart ?? '',
      timeEnd: schedule?.timeEnd ?? '',
    });
    this.clearAvailableTables();
  }

  availableSchedules(): WorkingScheduleResponseDTO[] {
    const date = this.form.controls.date.value;
    const restaurant = this.restaurant();
    if (!date || !restaurant) return [];

    const [year, month, day] = date.split('-').map(Number);
    const dayOfWeek = mapDayNumber.get(new Date(year, month - 1, day).getDay());
    if (!dayOfWeek) return [];

    return restaurant.workingDays
      .filter(schedule => schedule.dayOfWeek === dayOfWeek)
      .sort((first, second) => first.timeStart.localeCompare(second.timeStart));
  }

  searchTables(): void {
    if (this.isSearchingTables() || this.isSubmitting() || this.reservationCreated()) return;

    if (!this.canSearchTables()) {
      this.form.controls.date.markAsTouched();
      this.form.controls.workingScheduleId.markAsTouched();
      this.form.controls.peoples.markAsTouched();
      this.form.markAsTouched();
      return;
    }

    const restaurant = this.restaurant();
    if (!restaurant) {
      this.utilityService.handlerShowMenssageErrorSubject(
        new ExceptionResponse(400, 'Não foi possível identificar o restaurante.'),
      );
      return;
    }

    this.isSearchingTables.set(true);
    this.hasSearchedTables.set(false);
    this.tablesAvaliables.set([]);
    const requestId = ++this.tableSearchRequestId;

    this.tableService.getTablesAvailable(
      restaurant.id,
      this.form.controls.peoples.value,
      this.form.controls.date.value,
      this.form.controls.timeStart.value,
      this.form.controls.timeEnd.value,
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (tables) => {
        if (requestId !== this.tableSearchRequestId) return;
        this.tablesAvaliables.set(tables.filter(table => table.active));
        this.hasSearchedTables.set(true);
        this.isSearchingTables.set(false);
      },
      error: (error: HttpErrorResponse) => {
        if (requestId !== this.tableSearchRequestId) return;
        this.showRequestError(error);
        this.hasSearchedTables.set(false);
        this.isSearchingTables.set(false);
      },
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting() || this.reservationCreated()) return;

    const request = this.createRequest();
    if (!request) return;

    this.isSubmitting.set(true);
    this.reserveService.createReserve(request).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.reservationCreated.set(true);
        this.isSubmitting.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.showRequestError(error);
        this.isSubmitting.set(false);
      },
    });
  }

  private showRequestError(error: HttpErrorResponse): void {
    const shouldShowError = this.exceptionService.handlerRedirectExceptionResponse(
      error,
      UtilityService.pathsOfApplication.CLIENT_HOME,
    );
    if (shouldShowError) {
      this.utilityService.handlerShowMenssageErrorSubject(ExceptionResponse.fromHttpError(error));
    }
  }

  private createRequest(): CreateReserveRequestDTO | null {
    const { tableId, date, timeStart, timeEnd, peoples, observation } = this.form.getRawValue();
    if (tableId === null) return null;

    return { tableId, date, timeStart, timeEnd, peoples, observation };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getMinimumDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return this.formatDate(date);
  }
}
