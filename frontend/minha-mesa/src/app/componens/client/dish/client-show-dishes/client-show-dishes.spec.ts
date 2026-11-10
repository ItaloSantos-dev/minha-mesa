import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RestaurantService } from '../../../../service/restaurant-service/restaurant-service';
import { DishResponseDTO } from '../../../../types/dish/dish-repsonse';
import { DishesOfRestauranteResponseDTO } from '../../../../types/dish/dishes-of-restaurant-response';
import { DishCategoryResponseDTO } from '../../../../types/dish_category/dish-category-response';
import { ClientShowDishes } from './client-show-dishes';

describe('ClientShowDishes', () => {
  const activeDish: DishResponseDTO = {
    id: 1,
    name: 'Prato ativo',
    dishCategoryName: 'Massas',
    dishCategoryId: 1,
    restaurantName: 'Restaurante',
    restaurantId: 42,
    description: 'Descrição do prato',
    preparationTime: 1200,
    rating: 4.5,
    price: 25,
    slug: 'prato-ativo',
    imageLink: '',
    active: true,
  };

  const inactiveDish: DishResponseDTO = {
    ...activeDish,
    id: 2,
    name: 'Prato inativo',
    active: false,
  };

  const activeCategory: DishCategoryResponseDTO = {
    id: 1,
    restaurantId: '42',
    name: 'Massas',
    imageLink: '',
    active: true,
    slug: 'massas',
    dishes: [activeDish, inactiveDish],
  };

  const inactiveCategory: DishCategoryResponseDTO = {
    ...activeCategory,
    id: 2,
    name: 'Indisponíveis',
    active: false,
    dishes: [activeDish],
  };

  const response: DishesOfRestauranteResponseDTO = {
    categories: [activeCategory, inactiveCategory],
    dishesWithoutCategories: [
      { ...activeDish, id: 3, name: 'Sem categoria' },
      { ...inactiveDish, id: 4, name: 'Sem categoria inativo' },
    ],
  };

  let requestedRestaurantId = 0;

  beforeEach(async () => {
    requestedRestaurantId = 0;
    await TestBed.configureTestingModule({
      imports: [ClientShowDishes],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: '42' })) },
        },
        {
          provide: RestaurantService,
          useValue: {
            getDishesOfRestaurant: (id: number) => {
              requestedRestaurantId = id;
              return of(response);
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('loads dishes using the restaurant id from the route', () => {
    const fixture = TestBed.createComponent(ClientShowDishes);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(requestedRestaurantId).toBe(42);
    expect(component.restaurantId()).toBe(42);
    expect(component.loading()).toBe(false);
  });

  it('shows only active dishes from active categories and uncategorized dishes', () => {
    const fixture = TestBed.createComponent(ClientShowDishes);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.categories().length).toBe(1);
    expect(component.categories()[0].dishes.map((dish) => dish.id)).toEqual([1]);
    expect(component.dishesWithoutCategories().map((dish) => dish.id)).toEqual([3]);
    expect(component.totalDishCount()).toBe(2);
  });
});
