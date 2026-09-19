import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDashboardCard } from './owner-dashboard-card';

describe('OwnerDashboardCard', () => {
  let component: OwnerDashboardCard;
  let fixture: ComponentFixture<OwnerDashboardCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerDashboardCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerDashboardCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
