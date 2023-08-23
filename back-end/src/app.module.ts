import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Initiative } from './entities/initiative.entity';
import { Organization } from './entities/organization.entity';
import { Phase } from './entities/phase.entity';
import { Period } from './entities/period.entity';
import { WorkPackage } from './entities/workPackage.entity';
import { Result } from './entities/result.entity';
import { ResultPeriodValues } from './entities/resultPeriodValues.entity';
import { User } from './entities/user.entity';
import { Submission } from './entities/submission.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { InitiativesModule } from './initiatives/initiatives.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PhasesModule } from './phases/phases.module';
import { PeriodsModule } from './periods/periods.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubmissionModule } from './submission/submission.module';
import { MeliaModule } from './melia/melia.module';
import { Melia } from './entities/melia.entity';
@Module({
  imports: [
    
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'planning',
      entities: [
        Initiative,
        Organization,
        Phase,
        Period,
        WorkPackage,
        Result,
        ResultPeriodValues,
        User,
        Submission,
        Melia
      ],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    InitiativesModule,
    OrganizationsModule,
    PhasesModule,
    PeriodsModule,
    AuthModule,
    UsersModule,
    SubmissionModule,
    EventsModule,
    MeliaModule,

  ],
})
export class AppModule {}
