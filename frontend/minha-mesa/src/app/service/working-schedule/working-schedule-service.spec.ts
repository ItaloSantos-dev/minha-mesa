import { TestBed } from '@angular/core/testing';

import { WorkingScheduleService } from './working-schedule-service';

describe('WorkingScheduleService', () => {
  let service: WorkingScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkingScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
