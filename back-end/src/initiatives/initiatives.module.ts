import { Module } from '@nestjs/common';
import { InitiativesService } from './initiatives.service';
import { InitiativesController } from './initiatives.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Initiative } from 'src/entities/initiative.entity';
import { WorkPackage } from 'src/entities/workPackage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Initiative, WorkPackage]), HttpModule],
  controllers: [InitiativesController],
  providers: [InitiativesService],
})
export class InitiativesModule {}
