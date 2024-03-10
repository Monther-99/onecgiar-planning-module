import { Module } from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { InitiativesController } from './initiatives.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Initiative } from 'src/entities/initiative.entity';
import { WorkPackage } from 'src/entities/workPackage.entity';
import { InitiativeRoles } from 'src/entities/initiative-roles.entity';
import { User } from 'src/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { Email } from 'src/entities/email.entity';
import { Variable } from 'src/entities/variable.entity';


@Module({
  imports: [TypeOrmModule.forFeature([
    Initiative, WorkPackage,InitiativeRoles, User, Variable, Email]), HttpModule],
  controllers: [InitiativesController],
  providers: [InitiativesService, EmailService],
  exports: [InitiativesService]
})
export class InitiativesModule {}
