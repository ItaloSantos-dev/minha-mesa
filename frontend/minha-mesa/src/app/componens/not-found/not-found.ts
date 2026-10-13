import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from "@angular/common";
import { UtilityService } from '../../service/utility-service/utility-service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  private location = inject(Location);
  private utilityService = inject(UtilityService)
  private url = signal('');
  private router = inject(Router);

  static pathsOfApplication ={
    OWNER_DASHBOARD: 'owner/restaurant/dashboard',
    OWNER_SHOW_RESERVES: 'owner/restaurant/reservations',
    OWNER_SHOW_TABLES: 'owner/restaurant/tables',
    OWNER_SHOW_WORKING_SCHEDULES: 'owner/restaurant/working-schedules',
    OWNER_SHOW_SCHEDULE_EXCEPTIONS: 'owner/restaurant/schedule-exceptions'
  }

  goBack(): void {
    const returnUrl = history.state?.returnUrl ?? '/';
    console.log(returnUrl);
    
    this.router.navigateByUrl(returnUrl);
  }

  ngOnInit(){
    console.log("returnURL ", history.state?.returnUrl);
  }
}
