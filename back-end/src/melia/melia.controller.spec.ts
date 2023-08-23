import { Test, TestingModule } from '@nestjs/testing';
import { MeliaController } from './melia.controller';

describe('MeliaController', () => {
  let controller: MeliaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeliaController],
    }).compile();

    controller = module.get<MeliaController>(MeliaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
