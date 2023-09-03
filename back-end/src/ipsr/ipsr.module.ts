import { Module } from '@nestjs/common';
import { IpsrController } from './ipsr.controller';
import { IpsrService } from './ipsr.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ipsr } from 'src/entities/ipsr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ipsr])],
  controllers: [IpsrController],
  providers: [IpsrService],
  exports: [IpsrService],
})
export class IpsrModule {}
