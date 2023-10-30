import { Module } from '@nestjs/common';
import { IpsrController } from './ipsr.controller';
import { IpsrService } from './ipsr.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ipsr } from 'src/entities/ipsr.entity';
import { IpsrValue } from 'src/entities/ipsr-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ipsr, IpsrValue])],
  controllers: [IpsrController],
  providers: [IpsrService],
  exports: [IpsrService],
})
export class IpsrModule {}
