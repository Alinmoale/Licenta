import { TestBed } from '@angular/core/testing';

import { DoctorUnavailability } from './doctor-unavailability';

describe('DoctorUnavailability', () => {
  let service: DoctorUnavailability;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorUnavailability);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
