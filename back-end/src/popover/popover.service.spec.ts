import { Test, TestingModule } from '@nestjs/testing';
import { PopoverService } from './popover.service';

describe('PopoverService', () => {
  let service: PopoverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PopoverService],
    }).compile();

    service = module.get<PopoverService>(PopoverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
