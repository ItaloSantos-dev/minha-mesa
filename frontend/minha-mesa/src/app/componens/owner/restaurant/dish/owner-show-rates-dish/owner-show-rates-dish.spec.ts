import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShowRatesDish } from './owner-show-rates-dish';

describe('OwnerShowRatesDish', () => {
  let component: OwnerShowRatesDish;
  let fixture: ComponentFixture<OwnerShowRatesDish>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerShowRatesDish]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerShowRatesDish);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
