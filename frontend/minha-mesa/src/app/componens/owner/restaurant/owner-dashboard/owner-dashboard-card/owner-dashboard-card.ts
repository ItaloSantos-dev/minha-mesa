import { Component, input } from '@angular/core';

@Component({
  selector: 'app-owner-dashboard-card',
  imports: [],
  templateUrl: './owner-dashboard-card.html',
})
export class OwnerDashboardCard {
  icon = input.required<string>();
  title = input.required<string>();
  value = input.required<string>();
  detail = input('');
  accent = input('primary');

  
}
