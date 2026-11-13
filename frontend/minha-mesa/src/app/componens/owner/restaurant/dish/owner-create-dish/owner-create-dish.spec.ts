import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';

import { OwnerCreateDish } from './owner-create-dish';

describe('OwnerCreateDish', () => {
  let component: OwnerCreateDish;
  let fixture: ComponentFixture<OwnerCreateDish>;
  const restaurantService = {
    getDishesOfOwnerRestaurant: () =>
      of({ categories: [], dishesWithoutCategories: [] }),
    createDish: () => of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCreateDish],
      providers: [
        provideRouter([]),
        { provide: RestaurantService, useValue: restaurantService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCreateDish);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('creates the request with optional fields represented as null', () => {
    component.form.setValue({
      name: 'Risoto',
      dishCategory: null,
      description: '',
      preparationTime: 1200,
      price: 32.5,
    });

    expect(component.createDishRequest()).toEqual({
      name: 'Risoto',
      dishCategory: null,
      description: null,
      preparationTime: 1200,
      price: 32.5,
    });
  });
});
