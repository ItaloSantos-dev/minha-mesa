import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerShowDishCateogries } from './owner-show-dish-cateogries';

describe('OwnerShowDishCateogries', () => {
  let component: OwnerShowDishCateogries;
  let fixture: ComponentFixture<OwnerShowDishCateogries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerShowDishCateogries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerShowDishCateogries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
