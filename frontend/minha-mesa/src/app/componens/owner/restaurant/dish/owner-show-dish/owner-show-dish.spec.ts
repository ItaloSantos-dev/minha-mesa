import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShowDish } from './owner-show-dish';

describe('OwnerShowDish', () => {
  let component: OwnerShowDish;
  let fixture: ComponentFixture<OwnerShowDish>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerShowDish]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerShowDish);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
