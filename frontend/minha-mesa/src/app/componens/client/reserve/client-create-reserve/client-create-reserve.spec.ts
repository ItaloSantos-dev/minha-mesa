import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UtilityService } from '../../../../service/utility-service/utility-service';
import { mapDayNumber } from '../../../../types/enums/day-of-week';
import { afterEach, vi } from 'vitest';

import { ClientCreateReserve } from './client-create-reserve';

describe('ClientCreateReserve', () => {
  let component: ClientCreateReserve;
  let fixture: ComponentFixture<ClientCreateReserve>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCreateReserve],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCreateReserve);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject today and tomorrow as reservation dates', () => {
    const today = new Date();
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    component.form.controls.date.setValue(formatDate(today));
    expect(component.form.controls.date.hasError('invalidReserveDate')).toBe(true);

    component.form.controls.date.setValue(formatDate(tomorrow));
    expect(component.form.controls.date.hasError('invalidReserveDate')).toBe(true);

    component.form.controls.date.setValue(component.minDate);
    expect(component.form.controls.date.valid).toBe(true);
  });

  it('should search available tables and submit a reservation request', () => {
    fixture.componentRef.setInput('restaurant', {
      id: 42,
      name: 'Restaurante',
      phone: '',
      address: '',
      active: true,
      imagePerfilLink: '',
      imageBannerLink: '',
      workingDays: [{
        id: 1,
        dayOfWeek: mapDayNumber.get(new Date(`${component.minDate}T00:00`).getDay())!,
        timeStart: '18:00',
        timeEnd: '20:00',
      }],
    });
    component.form.patchValue({
      date: component.minDate,
      workingScheduleId: 1,
      timeStart: '18:00',
      timeEnd: '20:00',
      peoples: 3,
      observation: 'Mesa perto da janela',
    });

    component.searchTables();

    const tableRequest = httpTesting.expectOne(request => request.url === 'http://localhost:8080/tables');
    expect(tableRequest.request.params.get('restaurantId')).toBe('42');
    expect(tableRequest.request.params.get('capacity')).toBe('3');
    tableRequest.flush([
      { id: 7, number: 4, capacity: 4, active: true },
      { id: 8, number: 5, capacity: 4, active: false },
    ]);

    expect(component.tablesAvaliables()).toEqual([{ id: 7, number: 4, capacity: 4, active: true }]);
    component.form.controls.tableId.setValue(7);
    component.submit();

    const reserveRequest = httpTesting.expectOne('http://localhost:8080/reserves');
    expect(reserveRequest.request.body).toEqual({
      tableId: 7,
      date: component.minDate,
      timeStart: '18:00',
      timeEnd: '20:00',
      peoples: 3,
      observation: 'Mesa perto da janela',
    });
    reserveRequest.flush({ id: 1 });
    expect(component.reservationCreated()).toBe(true);
  });

  it('should send table search errors to the shared error message component', () => {
    const utilityService = TestBed.inject(UtilityService);
    const showError = vi.spyOn(utilityService, 'handlerShowMenssageErrorSubject');
    fixture.componentRef.setInput('restaurant', {
      id: 42,
      name: 'Restaurante',
      phone: '',
      address: '',
      active: true,
      imagePerfilLink: '',
      imageBannerLink: '',
      workingDays: [{
        id: 1,
        dayOfWeek: mapDayNumber.get(new Date(`${component.minDate}T00:00`).getDay())!,
        timeStart: '18:00',
        timeEnd: '20:00',
      }],
    });
    component.form.patchValue({
      date: component.minDate,
      workingScheduleId: 1,
      timeStart: '18:00',
      timeEnd: '20:00',
    });

    component.searchTables();
    const tableRequest = httpTesting.expectOne(request => request.url === 'http://localhost:8080/tables');
    tableRequest.flush(
      { menssage: 'Falha ao buscar mesas' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(showError).toHaveBeenCalledWith(
      expect.objectContaining({ status: 400, menssage: 'Falha ao buscar mesas' }),
    );
    expect(component.hasSearchedTables()).toBe(false);
  });
});
