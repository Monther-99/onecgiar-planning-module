import { Test, TestingModule } from '@nestjs/testing';
import { IpsrController } from './ipsr.controller';

describe('IpsrController', () => {
  let controller: IpsrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IpsrController],
    }).compile();

    controller = module.get<IpsrController>(IpsrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
