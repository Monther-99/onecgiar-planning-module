import { TestBed } from '@angular/core/testing';

import { AnticipatedYearService } from './anticipated-year.service';

describe('AnticipatedYearService', () => {
  let service: AnticipatedYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnticipatedYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
