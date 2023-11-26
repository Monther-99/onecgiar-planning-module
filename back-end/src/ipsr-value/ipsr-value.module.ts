import { Module } from '@nestjs/common';
import { IpsrValueController } from './ipsr-value.controller';
import { IpsrValueService } from './ipsr-value.service';
import { IpsrValue } from 'src/entities/ipsr-value.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpsrModule } from 'src/ipsr/ipsr.module';

@Module({
  imports: [TypeOrmModule.forFeature([IpsrValue]),IpsrModule],
  controllers: [IpsrValueController],
  providers: [IpsrValueService],
  exports: [IpsrValueService]
})
export class IpsrValueModule {}

