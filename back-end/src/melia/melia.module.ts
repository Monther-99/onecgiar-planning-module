import { Module } from '@nestjs/common';
import { MeliaController } from './melia.controller';
import { MeliaService } from './melia.service';
// import { Melia } from 'src/entities/melia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MeliaTypes } from 'src/entities/melia-types.entity';
import { Partner } from 'src/entities/partner.entity';
// import { InitiativeMelia } from 'src/entities/initiative-melia.entity';
import { Initiative } from 'src/entities/initiative.entity';
import { Email } from 'src/entities/email.entity';
import { Variable } from 'src/entities/variable.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([ MeliaTypes, Partner, Initiative, Email, Variable]), HttpModule
  ],
  controllers: [MeliaController],
  providers: [MeliaService, EmailService],
  exports: [MeliaService]
})
export class MeliaModule {}
