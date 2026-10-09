import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCreateScheduleException } from './owner-create-schedule-exception';

describe('OwnerCreateScheduleException', () => {
  let component: OwnerCreateScheduleException;
  let fixture: ComponentFixture<OwnerCreateScheduleException>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCreateScheduleException]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCreateScheduleException);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
