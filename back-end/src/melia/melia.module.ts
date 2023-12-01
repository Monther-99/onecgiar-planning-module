import { Module } from '@nestjs/common';
import { MeliaController } from './melia.controller';
import { MeliaService } from './melia.service';
import { Melia } from 'src/entities/melia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MeliaTypes } from 'src/entities/melia-types.entity';
import { Partner } from 'src/entities/partner.entity';
import { InitiativeMelia } from 'src/entities/initiative-melia.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Melia, MeliaTypes, Partner, InitiativeMelia]), HttpModule
  ],
  controllers: [MeliaController],
  providers: [MeliaService],
  exports: [MeliaService]
})
export class MeliaModule {}
