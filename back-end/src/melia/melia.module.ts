import { Module } from '@nestjs/common';
import { MeliaController } from './melia.controller';
import { MeliaService } from './melia.service';
import { Melia } from 'src/entities/melia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MeliaTypes } from 'src/entities/melia-types.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Melia, MeliaTypes]), HttpModule
  ],
  controllers: [MeliaController],
  providers: [MeliaService]
})
export class MeliaModule {}
