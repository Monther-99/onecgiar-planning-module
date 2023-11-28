import { TestBed } from '@angular/core/testing';

import { PopoverManagementService } from './popover-management.service';

describe('PopoverManagementService', () => {
  let service: PopoverManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopoverManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
