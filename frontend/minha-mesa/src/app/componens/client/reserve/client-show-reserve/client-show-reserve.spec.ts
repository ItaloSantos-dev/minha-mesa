import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientShowReserve } from './client-show-reserve';

describe('ClientShowReserve', () => {
  let component: ClientShowReserve;
  let fixture: ComponentFixture<ClientShowReserve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShowReserve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientShowReserve);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
