import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSearchRestaurants } from './client-search-restaurants';

describe('ClientSearchRestaurants', () => {
  let component: ClientSearchRestaurants;
  let fixture: ComponentFixture<ClientSearchRestaurants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSearchRestaurants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSearchRestaurants);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
