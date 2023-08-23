import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from 'src/entities/submission.entity';
import { Result } from 'src/entities/result.entity';
import { ResultPeriodValues } from 'src/entities/resultPeriodValues.entity';
import { WorkPackage } from 'src/entities/workPackage.entity';
import { Organization } from 'src/entities/organization.entity';
import { Period } from 'src/entities/period.entity';
import { User } from 'src/entities/user.entity';
import { Phase } from 'src/entities/phase.entity';
import { Initiative } from 'src/entities/initiative.entity';
import { HttpModule } from '@nestjs/axios';

import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Submission,
      User,
      Phase,
      Initiative,
      Organization,
      WorkPackage,
      Result,
      Period,
      ResultPeriodValues,
    ]),
    HttpModule,
    CacheModule.register()
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
