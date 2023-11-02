import { Body, Controller, Get, Patch, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constants } from 'src/entities/constants.entity';
import { Repository } from 'typeorm';

@Controller('constants')
export class ConstantsController {
    constructor(
        @InjectRepository(Constants) private phaseRepository: Repository<Constants>
      ) {}
    
    @Get('system-submit')
    async getSubmitStatus() {
        return await this.phaseRepository.findOne({where: { id: 1 }})
    }

    @Patch('update-system-submit')
    async changeSubmitStatus(@Body() value: any) {
        const publish =  await this.phaseRepository.findOne({ where: { id: 1 } });
        publish.value =  value.status;
        return await this.phaseRepository.save(publish);
    }
}
