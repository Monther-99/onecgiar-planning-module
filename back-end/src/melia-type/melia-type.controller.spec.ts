import { Test, TestingModule } from '@nestjs/testing';
import { MeliaTypeController } from './melia-type.controller';

describe('MeliaTypeController', () => {
  let controller: MeliaTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeliaTypeController],
    }).compile();

    controller = module.get<MeliaTypeController>(MeliaTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
