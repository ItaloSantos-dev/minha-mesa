import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { RestaurantService } from './restaurant-service';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(RestaurantService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('requests dishes using the restaurant id in the route', () => {
    service.getDishesOfRestaurant(42).subscribe();

    const request = httpTestingController.expectOne(
      'http://localhost:8080/restaurants/42/dishes',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ categories: [], dishesWithoutCategories: [] });
  });

  it('requests dishes for the authenticated restaurant', () => {
    service.getDishesOfOwnerRestaurant().subscribe();

    const request = httpTestingController.expectOne(
      'http://localhost:8080/restaurants/dishes',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ categories: [], dishesWithoutCategories: [] });
  });
});
