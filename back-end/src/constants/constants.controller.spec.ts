import { Test, TestingModule } from '@nestjs/testing';
import { ConstantsController } from './constants.controller';

describe('ConstantsController', () => {
  let controller: ConstantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstantsController],
    }).compile();

    controller = module.get<ConstantsController>(ConstantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
