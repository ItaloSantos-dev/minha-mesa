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

  

  goBack(): void {
    const returnUrl = history.state?.returnUrl ?? '/';
    console.log(returnUrl);
    
    this.router.navigateByUrl(returnUrl);
  }

  ngOnInit(){
    console.log("returnURL ", history.state?.returnUrl);
  }
}
