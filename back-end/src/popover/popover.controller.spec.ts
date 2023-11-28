import { Test, TestingModule } from '@nestjs/testing';
import { PopoverController } from './popover.controller';
import { PopoverService } from './popover.service';

describe('PopoverController', () => {
  let controller: PopoverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PopoverController],
      providers: [PopoverService],
    }).compile();

    controller = module.get<PopoverController>(PopoverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
