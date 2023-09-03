import { Test, TestingModule } from '@nestjs/testing';
import { IpsrValueController } from './ipsr-value.controller';

describe('IpsrValueController', () => {
  let controller: IpsrValueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IpsrValueController],
    }).compile();

    controller = module.get<IpsrValueController>(IpsrValueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
