import { Module } from '@nestjs/common';
import { ConstantsController } from './constants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Constants } from 'src/entities/constants.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Constants]),
  ],
  controllers: [ConstantsController]
})
export class ConstantsModule {}
