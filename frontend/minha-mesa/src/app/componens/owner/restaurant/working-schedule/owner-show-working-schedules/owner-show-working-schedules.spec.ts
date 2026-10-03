import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShowWorkingSchedules } from './owner-show-working-schedules';

describe('OwnerShowWorkingSchedules', () => {
  let component: OwnerShowWorkingSchedules;
  let fixture: ComponentFixture<OwnerShowWorkingSchedules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerShowWorkingSchedules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerShowWorkingSchedules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
