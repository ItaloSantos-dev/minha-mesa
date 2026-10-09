import { ChangeDetectionStrategy, Component, ElementRef, inject, output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CreateScheduleExceptionRequestDTO } from '../../../../../types/schedule_exception/create-schedule-exception-request';
import { ScheduleExceptionService } from '../../../../../service/schedule-exception-service/schedule-exception-service';

const notPastDate: ValidatorFn = (control) => {
  const value = control.value;
  if (typeof value !== 'string' || !value) return null;

  const today = new Date();
  const todayValue = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  return value < todayValue ? { pastDate: true } : null;
};

@Component({
  selector: 'app-owner-create-schedule-exception',
  imports: [ReactiveFormsModule],
  templateUrl: './owner-create-schedule-exception.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerCreateScheduleException {
  readonly closed = output<boolean>();

  private scheduleExceptionService = inject(ScheduleExceptionService);

  @ViewChild('main')
  main!: ElementRef<HTMLElement>;

  readonly form = new FormGroup({
    date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notPastDate],
    }),
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  close(created: boolean) {
    this.closed.emit(created);
  }

  createScheduleExceptionRequest():CreateScheduleExceptionRequestDTO{
    return{
      date: this.form.get('date')?.value as string,
      reason: this.form.get('reason')?.value as string,
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.scheduleExceptionService.createWorkingScheduleException(this.createScheduleExceptionRequest()).subscribe({
      next:(dado) =>{
        this.close(true);
      },error: (err) =>{
        console.log(err);
      }
    })
    
  }

}
