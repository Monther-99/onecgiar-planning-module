import { Module } from '@nestjs/common';
import { MeliaController } from './melia.controller';
import { MeliaService } from './melia.service';
import { Melia } from 'src/entities/melia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([Melia])
  ],
  controllers: [MeliaController],
  providers: [MeliaService]
})
export class MeliaModule {}
