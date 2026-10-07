import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCreateWorkingSchedules } from './owner-create-working-schedules';

describe('OwnerCreateWorkingSchedules', () => {
  let component: OwnerCreateWorkingSchedules;
  let fixture: ComponentFixture<OwnerCreateWorkingSchedules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCreateWorkingSchedules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCreateWorkingSchedules);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
