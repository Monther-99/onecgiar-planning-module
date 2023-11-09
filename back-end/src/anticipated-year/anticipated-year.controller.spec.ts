import { Test, TestingModule } from '@nestjs/testing';
import { AnticipatedYearController } from './anticipated-year.controller';

describe('AnticipatedYearController', () => {
  let controller: AnticipatedYearController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnticipatedYearController],
    }).compile();

    controller = module.get<AnticipatedYearController>(AnticipatedYearController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
