import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { OwnerCreateWorkingSchedules } from '../owner-create-working-schedules/owner-create-working-schedules';
import { UtilityService } from '../../../../../service/utility-service/utility-service';
import { DayOfWeek } from '../../../../../types/enums/day-of-week';
import { CreateWorkingScheduleRequestDTO } from '../../../../../types/working_schedule/create-working-schedule-request';
import { WorkingScheduleResponseDTO } from '../../../../../types/working_schedule/working-schedule-response';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { gsap } from 'gsap/gsap-core';

@Component({
  selector: 'app-owner-show-working-schedules',
  imports: [OwnerCreateWorkingSchedules],
  templateUrl: './owner-show-working-schedules.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerShowWorkingSchedules {
  private readonly utilityService = inject(UtilityService);
  private restaurantService = inject(RestaurantService);

  readonly schedulesMock: WorkingScheduleResponseDTO[] = [
    { id: 1, dayOfWeek: DayOfWeek.MONDAY, timeStart: '11:00', timeEnd: '22:00' },
    { id: 2, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '11:00', timeEnd: '22:00' },
    { id: 3, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '11:00', timeEnd: '22:00' },
    { id: 4, dayOfWeek: DayOfWeek.THURSDAY, timeStart: '11:00', timeEnd: '22:00' },
    { id: 5, dayOfWeek: DayOfWeek.FRIDAY, timeStart: '11:00', timeEnd: '23:00' },
    { id: 6, dayOfWeek: DayOfWeek.SATURDAY, timeStart: '12:00', timeEnd: '23:00' },
    { id: 7, dayOfWeek: DayOfWeek.SUNDAY, timeStart: '12:00', timeEnd: '20:00' },

    { id: 8, dayOfWeek: DayOfWeek.MONDAY, timeStart: '18:00', timeEnd: '23:00' },
    { id: 9, dayOfWeek: DayOfWeek.TUESDAY, timeStart: '18:00', timeEnd: '23:00' },
    { id: 10, dayOfWeek: DayOfWeek.WEDNESDAY, timeStart: '18:00', timeEnd: '23:00' },
  ];

  readonly schedules = signal(<WorkingScheduleResponseDTO[]>[]);
  readonly isCreateFormOpen = signal(false);
  readonly currentPage = signal(0);
  pageSize = 0;

  readonly totalPages = signal(0);

  

  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));

  @ViewChild('createWorkingSchedule', { read: ElementRef })
  createWorkingSchedule!: ElementRef<HTMLElement>;

  

  handlerShowCreateForm(haveNewWorkingSchedule:boolean) {
    const mainCreateWorkingSchedule = this.createWorkingSchedule.nativeElement;
    this.isCreateFormOpen.set(!this.isCreateFormOpen())

    if (this.isCreateFormOpen()) {
      gsap.set(
        mainCreateWorkingSchedule,
        {
          display:'flex'
        }
      )
      gsap.to(
        mainCreateWorkingSchedule, 
        {
          opacity: 1,
          duration: 0.3
        }
      );
    }
    else{
      gsap.to(
        mainCreateWorkingSchedule, 
        {
          opacity: 0,
          duration: 0.3,
          onComplete: (() =>{
            gsap.set(
              mainCreateWorkingSchedule,
              {
                display:'none'
              }
            )
          })
        }
      );
      if (haveNewWorkingSchedule) {
        this.loadWorkingSchedules(1,true);
      }
    }
  }

 

  

  readonly dayLabels: Record<DayOfWeek, string> = {
    [DayOfWeek.MONDAY]: 'Segunda-feira',
    [DayOfWeek.TUESDAY]: 'Terça-feira',
    [DayOfWeek.WEDNESDAY]: 'Quarta-feira',
    [DayOfWeek.THURSDAY]: 'Quinta-feira',
    [DayOfWeek.FRIDAY]: 'Sexta-feira',
    [DayOfWeek.SATURDAY]: 'Sábado',
    [DayOfWeek.SUNDAY]: 'Domingo',
  };

  updatePageValues(next:boolean){
    const schedulesCount = this.schedules().length;
    this.pageSize=schedulesCount;
    const haveMoreSchedules = this.schedules().length===10;
    this.currentPage.set(next? this.currentPage()+1 : this.currentPage()-1);
    this.totalPages.set(haveMoreSchedules? this.currentPage()+1 : this.currentPage());
    
  }


  loadWorkingSchedules(page:number, next:boolean){
    console.log(page);
    const realPage = page>0 ? page-1 :page;
    this.restaurantService.getWorkingSchedulesOfRestaurant(realPage).subscribe({
      next:(data) =>{
        this.schedules.set(data);
        this.updatePageValues(next);
      },error: (err) =>{
        console.log(err);
      }
    })
  }

  ngOnInit() {
    this.loadWorkingSchedules(1, true);
    this.utilityService.updateCurrentPageOfOwnerMenu(3);
  }

}
