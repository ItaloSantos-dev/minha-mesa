import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-testimonial-card',
  imports: [],
  templateUrl: './testimonial-card.html',
  styleUrl: './testimonial-card.css',
})
export class TestimonialCard {
  @Input() name: string = '';
  @Input() message: string = '';
  @Input() image: string = '';
}
