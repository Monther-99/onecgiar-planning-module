import { Module } from '@nestjs/common';
import { CrossCuttingController } from './cross-cutting.controller';
import { CrossCuttingService } from './cross-cutting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossCutting } from 'src/entities/cross-cutting.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([CrossCutting])
  ],
  controllers: [CrossCuttingController],
  providers: [CrossCuttingService],
  exports: [CrossCuttingService]
})
export class CrossCuttingModule {}
