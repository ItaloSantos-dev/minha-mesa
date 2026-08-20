import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-boxes',
  imports: [],
  templateUrl: './boxes.html',
  styleUrl: './boxes.css',
})
export class Boxes {
  @Input() class = '';

  rows = Array.from({ length: 150 });
  cols = Array.from({ length: 100 });

  private colors = [
    '#D2AB65', // bege-yellow
    '#D9D1B8', // bege2
    '#8C8270', // gray2
    '#B8935A', // bege-yellow mais escuro
    '#E8C98A', // bege-yellow mais claro
    '#A69B7D', // variação de bege2
    '#5C4630', // marrom intermediário (entre brown2 e bege-yellow)
    '#F2F2F2', // white2
  ];

  private getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  onEnter(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    el.style.transitionDuration = '0ms';
    el.style.backgroundColor = this.getRandomColor();
  }

  onLeave(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    el.style.transitionDuration = '2000ms';
    el.style.backgroundColor = 'transparent';
  }

  isPlus(i: number, j: number): boolean {
    return j % 2 === 0 && i % 2 === 0;
  }
}
