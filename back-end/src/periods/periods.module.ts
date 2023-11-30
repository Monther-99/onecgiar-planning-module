import { Module } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { PeriodsController } from './periods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from 'src/entities/period.entity';
import { ResultPeriodValues } from 'src/entities/resultPeriodValues.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Period, ResultPeriodValues])],
  controllers: [PeriodsController],
  providers: [PeriodsService],
  exports: [PeriodsService]
})
export class PeriodsModule {}
