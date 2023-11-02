import { TestBed } from '@angular/core/testing';

import { MeliaTypeService } from './melia-type.service';

describe('MeliaTypeService', () => {
  let service: MeliaTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeliaTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
