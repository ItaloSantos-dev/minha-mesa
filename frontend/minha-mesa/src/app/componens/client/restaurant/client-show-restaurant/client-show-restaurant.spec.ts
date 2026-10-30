import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientShowRestaurant } from './client-show-restaurant';

describe('ClientShowRestaurant', () => {
  let component: ClientShowRestaurant;
  let fixture: ComponentFixture<ClientShowRestaurant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShowRestaurant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientShowRestaurant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
