import { Test, TestingModule } from '@nestjs/testing';
import { CrossCuttingService } from './cross-cutting.service';

describe('CrossCuttingService', () => {
  let service: CrossCuttingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrossCuttingService],
    }).compile();

    service = module.get<CrossCuttingService>(CrossCuttingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
