import { Test, TestingModule } from '@nestjs/testing';
import { CrossCuttingController } from './cross-cutting.controller';

describe('CrossCuttingController', () => {
  let controller: CrossCuttingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrossCuttingController],
    }).compile();

    controller = module.get<CrossCuttingController>(CrossCuttingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
