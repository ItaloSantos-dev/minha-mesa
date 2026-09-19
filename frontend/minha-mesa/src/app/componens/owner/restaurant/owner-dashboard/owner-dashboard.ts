import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OwnerDashboardCard } from './owner-dashboard-card/owner-dashboard-card';

@Component({
  selector: 'app-owner-dashboard',
  imports: [OwnerDashboardCard],
  templateUrl: './owner-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerDashboard {
  readonly metrics = [
    { icon: 'bi bi-calendar3', title: 'Reservas totais', value: '24', detail: '+12% esta semana', accent: 'primary' },
    { icon: 'bi bi-clock', title: 'Aguardando confirmação', value: '08', detail: '3 para hoje', accent: 'highlight' },
    { icon: 'bi bi-check-circle', title: 'Reservas confirmadas', value: '16', detail: '67% da agenda', accent: 'secondary' },
    { icon: 'bi bi-people-fill', title: 'Pessoas esperadas', value: '58', detail: 'Pico às 20h', accent: 'coffee' },
  ];

  readonly schedule = [
    { time: '19:00', name: 'Mariana Costa', people: '4 pessoas', table: 'Mesa 08', status: 'Confirmada', statusClass: 'confirmed' },
    { time: '19:30', name: 'Rafael Mendes', people: '2 pessoas', table: 'Mesa 03', status: 'Aguardando', statusClass: 'waiting' },
    { time: '20:00', name: 'Camila Oliveira', people: '6 pessoas', table: 'Mesa 12', status: 'Confirmada', statusClass: 'confirmed' },
    { time: '20:30', name: 'Joao Almeida', people: '3 pessoas', table: 'Mesa 05', status: 'Aguardando', statusClass: 'waiting' },
  ];

  readonly occupancy = [
    { label: 'Mesas ocupadas', value: '08', percentage: 66, color: 'var(--color-primary)' },
    { label: 'Mesas livres', value: '04', percentage: 34, color: 'var(--color-secondary)' },
  ];

  dataAtual = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());
}
