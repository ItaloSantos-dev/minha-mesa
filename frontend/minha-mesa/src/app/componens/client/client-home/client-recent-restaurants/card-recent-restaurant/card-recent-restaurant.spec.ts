import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRecentRestaurant } from './card-recent-restaurant';

describe('CardRecentRestaurant', () => {
  let component: CardRecentRestaurant;
  let fixture: ComponentFixture<CardRecentRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRecentRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRecentRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
