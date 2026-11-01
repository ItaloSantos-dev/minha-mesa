import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ReserveStatus } from '../../../../types/enums/reserve-status';

import { ClientShowReserves } from './client-show-reserves';

describe('ClientShowReserves', () => {
  let component: ClientShowReserves;
  let fixture: ComponentFixture<ClientShowReserves>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientShowReserves],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientShowReserves);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => httpTesting.verify());

  const createReserve = (id: number) => ({
    id,
    clientName: 'Cliente',
    restaurantName: 'Restaurante',
    tableNumber: id,
    date: '2026-11-15',
    dayOfWeek: 'SUNDAY',
    timeStart: '18:00:00',
    timeEnd: '20:00:00',
    status: ReserveStatus.SCHEDULED,
    observation: 'Sem cebola',
    peoples: 3,
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    httpTesting.expectOne('http://localhost:8080/users/reserves?page=0&size=10').flush([]);
  });

  it('should load a page of reservations and enable the next page when full', () => {
    const firstPageRequest = httpTesting.expectOne('http://localhost:8080/users/reserves?page=0&size=10');
    firstPageRequest.flush(Array.from({ length: 10 }, (_, index) => createReserve(index + 1)));

    expect(component.reserves()).toHaveLength(10);
    expect(component.actualPage()).toBe(0);
    expect(component.haveMoreReserves()).toBe(true);

    component.loadReserves(1);
    httpTesting.expectOne('http://localhost:8080/users/reserves?page=1&size=10')
      .flush([createReserve(11)]);

    expect(component.reserves()).toEqual([createReserve(11)]);
    expect(component.actualPage()).toBe(1);
    expect(component.haveMoreReserves()).toBe(false);
  });
});
