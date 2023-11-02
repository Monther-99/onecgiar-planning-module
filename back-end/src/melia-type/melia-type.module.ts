import { Module } from '@nestjs/common';
import { MeliaTypeController } from './melia-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeliaTypes } from 'src/entities/melia-types.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([MeliaTypes])
  ],
  controllers: [MeliaTypeController]
})
export class MeliaTypeModule {}
