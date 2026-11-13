import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCreateDishCategory } from './owner-create-dish-category';

describe('OwnerCreateDishCategory', () => {
  let component: OwnerCreateDishCategory;
  let fixture: ComponentFixture<OwnerCreateDishCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCreateDishCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCreateDishCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
