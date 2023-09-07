import { TestBed } from '@angular/core/testing';

import { IpsrService } from './ipsr.service';

describe('IpsrService', () => {
  let service: IpsrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpsrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
