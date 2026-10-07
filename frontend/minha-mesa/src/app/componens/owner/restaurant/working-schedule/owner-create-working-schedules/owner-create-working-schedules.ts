import { ChangeDetectionStrategy, Component, ElementRef, inject, output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { DayOfWeek } from '../../../../../types/enums/day-of-week';
import { CreateWorkingScheduleRequestDTO } from '../../../../../types/working_schedule/create-working-schedule-request';
import { WorkingScheduleService } from '../../../../../service/working-schedule/working-schedule-service';

const validTimeRange: ValidatorFn = (control) => {
  const timeStart = control.get('timeStart')?.value as string | null;
  const timeEnd = control.get('timeEnd')?.value as string | null;

  if (!timeStart || !timeEnd) return null;
  return timeStart < timeEnd ? null : { invalidTimeRange: true };
};

@Component({
  selector: 'app-owner-create-working-schedules',
  imports: [ReactiveFormsModule],
  templateUrl: './owner-create-working-schedules.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerCreateWorkingSchedules {
  readonly closed = output<boolean>();
  private workingScheduleService = inject(WorkingScheduleService);
  

  @ViewChild('main')
  main!:ElementRef<HTMLElement>;

  readonly days = [
    { value: DayOfWeek.MONDAY, label: 'Segunda-feira' },
    { value: DayOfWeek.TUESDAY, label: 'Terça-feira' },
    { value: DayOfWeek.WEDNESDAY, label: 'Quarta-feira' },
    { value: DayOfWeek.THURSDAY, label: 'Quinta-feira' },
    { value: DayOfWeek.FRIDAY, label: 'Sexta-feira' },
    { value: DayOfWeek.SATURDAY, label: 'Sábado' },
    { value: DayOfWeek.SUNDAY, label: 'Domingo' },
  ];

  readonly form = new FormGroup({
    dayOfWeek: new FormControl<DayOfWeek>(DayOfWeek.MONDAY, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    timeStart: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    timeEnd: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  }, { validators: validTimeRange });

  close(value:boolean) {
    this.closed.emit(value);
  }

  generateCreateWorkingScheduleRequest():CreateWorkingScheduleRequestDTO{
    return {
      dayOfWeek: this.form.get("dayOfWeek")?.value as DayOfWeek,
      timeStart: this.form.get("timeStart")?.value as string,
      timeEnd: this.form.get("timeEnd")?.value as string
    }
  }

  submit() {
    console.log("VEIO");
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.workingScheduleService.createWorkingSchedule(this.generateCreateWorkingScheduleRequest()).subscribe({
      next:(dado) =>{
        this.close(true);
      }
    })
    
  }

}
