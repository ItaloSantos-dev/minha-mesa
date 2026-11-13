import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ExceptionService } from '../../../../../service/exception-service/exception-service';
import { RestaurantService } from '../../../../../service/restaurant-service/restaurant-service';
import { DishesOfRestauranteResponseDTO } from '../../../../../types/dish/dishes-of-restaurant-response';

import { OwnerShowDishes } from './owner-show-dishes';

describe('OwnerShowDishes', () => {
  let component: OwnerShowDishes;
  let fixture: ComponentFixture<OwnerShowDishes>;
  const dishesResponse: DishesOfRestauranteResponseDTO = {
    categories: [],
    dishesWithoutCategories: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerShowDishes],
      providers: [
        {
          provide: RestaurantService,
          useValue: {
            getDishesOfOwnerRestaurant: () => of(dishesResponse),
          },
        },
        {
          provide: ExceptionService,
          useValue: {
            handlerRedirectExceptionResponse: () => false,
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerShowDishes);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the dishes returned for the owner restaurant', () => {
    expect(component.dishesOfRestaurant()).toEqual(dishesResponse);
    expect(component.hasDishes()).toBe(false);
  });
});
