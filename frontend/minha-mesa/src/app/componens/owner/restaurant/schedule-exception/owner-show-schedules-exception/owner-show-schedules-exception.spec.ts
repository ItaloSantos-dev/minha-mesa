import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShowSchedulesException } from './owner-show-schedules-exception';

describe('OwnerShowSchedulesException', () => {
  let component: OwnerShowSchedulesException;
  let fixture: ComponentFixture<OwnerShowSchedulesException>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerShowSchedulesException]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerShowSchedulesException);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
