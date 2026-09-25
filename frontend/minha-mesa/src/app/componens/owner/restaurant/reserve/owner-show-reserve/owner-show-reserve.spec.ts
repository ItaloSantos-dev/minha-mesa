import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShowReserve } from './owner-show-reserve';

describe('OwnerShowReserve', () => {
  let component: OwnerShowReserve;
  let fixture: ComponentFixture<OwnerShowReserve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerShowReserve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerShowReserve);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
