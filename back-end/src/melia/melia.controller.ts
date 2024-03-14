import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MeliaService } from './melia.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/roles.guard';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
// import { Melia } from 'src/entities/melia.entity';
import { createInitiativeMeliaRes, createMeliaReq, createMeliaRes, findInitiative_id, findOne, getImportMeliaTypes, getInitiativeMeliaById, getInitiativeMelias, getMeliaTypes, updateInitiativeMeliaReq, updateInitiativeMeliaRes, updateMeliaReq, updateMeliaRes } from 'DTO/melia.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('melia')
@Controller('melia')
export class MeliaController {
  constructor(private readonly meliaService: MeliaService) {}

  @Get('from-ost/:id')
  findAllOst(@Param('id') id) {
    return this.meliaService.getOstMelias(id);
  }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: [Melia],
  // })
  // @Get()
  // findAll() {
  //   return this.meliaService.findAll();
  // }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: [getMeliaTypes],
  })
  @Get('types')
  getMeliaTypes() {
    return this.meliaService.getMeliaTypes();
  }

  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  // @ApiCreatedResponse({
  //   description: '',
  //   type: [getImportMeliaTypes],
  // })
  // @Get('import/types')
  // async getImportMeliaTypes() {
  //   await this.meliaService.importMeliaTypes();
  //   return 'Melia study types imported successfully';
  // }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: [findInitiative_id],
  // })
  // @Get('initiative/:initiative_id')
  // findInitiative_id(@Param('initiative_id') initiative_id) {
  //   return this.meliaService.findByInitiativeID(initiative_id);
  // }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: [findInitiative_id],
  // })
  // @Get('submission/:submission_id')
  // getSubmissionMelia(@Param('submission_id') submission_id: string) {
  //   return this.meliaService.findBySubmissionId(+submission_id);
  // }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: [getInitiativeMelias],
  // })
  // @Get('initiative-melias/:initiative_id')
  // getInitiativeMelias(@Param('initiative_id') initiative_id, @Query() query) {
  //   return this.meliaService.getInitiativeMelias(initiative_id, query);
  // }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: getInitiativeMeliaById,
  // })
  // @Get('initiative-melia/:id')
  // getInitiativeMeliaById(@Param('id') id) {
  //   return this.meliaService.getInitiativeMeliaById(id);
  // }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: getInitiativeMeliaById,
  // })
  // @Get('initiative-melia/:initiative_id/:type_id')
  // getInitiativeMelia(
  //   @Param('initiative_id') initiative_id,
  //   @Param('type_id') melia_type_id,
  // ) {
  //   return this.meliaService.getInitiativeMelia(initiative_id, melia_type_id);
  // }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: findOne,
  // })
  // @Get(':id')
  // findOne(@Param('id') id) {
  //   return this.meliaService.findOne(id);
  // }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: updateMeliaRes,
  // })
  // @ApiBody({ type: updateMeliaReq})
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() body) {
  //   return this.meliaService.update(id, body);
  // }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: updateInitiativeMeliaRes,
  // })
  // @ApiBody({ type: updateInitiativeMeliaReq })
  // @Patch('initiative-melia/:id')
  // updateInitiativeMelia(@Param('id') id: string, @Body() body) {
  //   return this.meliaService.updateInitiativeMelia(+id, body);
  // }

  // @ApiBearerAuth()
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.meliaService.remove(id);
  // }

  // @ApiBearerAuth()
  // @Delete('initiative-melia/:id')
  // removeInitiativeMelia(@Param('id') id: string) {
  //   return this.meliaService.removeInitiativeMelia(+id);
  // }
  
  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: createMeliaRes,
  // })
  // @ApiBody({ type: createMeliaReq })
  // @Post()
  // create(@Body() body) {
  //   return this.meliaService.create(body);
  // }

  // @ApiBearerAuth()
  // @ApiCreatedResponse({
  //   description: '',
  //   type: createInitiativeMeliaRes,
  // })
  // @ApiBody({ type: updateInitiativeMeliaReq })
  // @Post('initiative-melia')
  // createInitiativeMelia(@Body() body) {
  //   return this.meliaService.createInitiativeMelia(body);
  // }
}
