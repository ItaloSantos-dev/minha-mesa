import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCardRestaurant } from './client-card-restaurant';

describe('ClientCardRestaurant', () => {
  let component: ClientCardRestaurant;
  let fixture: ComponentFixture<ClientCardRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCardRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCardRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
