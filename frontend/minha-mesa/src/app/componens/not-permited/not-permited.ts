import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-permited',
  imports: [RouterLink],
  templateUrl: './not-permited.html',
  styleUrl: './not-permited.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotPermited {
  private readonly router = inject(Router);

  goBack(): void {
    const returnUrl = history.state?.returnUrl ?? '/';
    this.router.navigateByUrl(returnUrl);
  }
}
