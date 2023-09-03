import { Test, TestingModule } from '@nestjs/testing';
import { IpsrValueService } from './ipsr-value.service';

describe('IpsrValueService', () => {
  let service: IpsrValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpsrValueService],
    }).compile();

    service = module.get<IpsrValueService>(IpsrValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
