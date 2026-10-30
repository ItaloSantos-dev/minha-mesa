import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientShowRestaurantWorkingSchedules } from './client-show-restaurant-working-schedules';

describe('ClientShowRestaurantWorkingSchedules', () => {
  let component: ClientShowRestaurantWorkingSchedules;
  let fixture: ComponentFixture<ClientShowRestaurantWorkingSchedules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShowRestaurantWorkingSchedules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientShowRestaurantWorkingSchedules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
