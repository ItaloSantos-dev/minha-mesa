import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRecentRestaurants } from './client-recent-restaurants';

describe('ClientRecentRestaurants', () => {
  let component: ClientRecentRestaurants;
  let fixture: ComponentFixture<ClientRecentRestaurants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientRecentRestaurants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientRecentRestaurants);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
