import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  getAll,
  getSaved,
  getTocs,
  getWpBudgets,
  getbyid,
  saveReq,
  saveResponse,
  saveWpBudgetReq,
  save_result_values_req,
  updateCenterStatusReq,
  updateCenterStatusRes,
  updateStatus,
} from 'src/DTO/submission.dto';
@UseGuards(JwtAuthGuard)
@ApiTags('submission')
@Controller('submission')
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly httpService: HttpService,
  ) {}

  @Patch('status/:id')
  @ApiBearerAuth()
  @ApiBody({ type: updateStatus })
  updateStatus(@Param('id') id, @Body() data) {
    return this.submissionService.updateStatusBySubmittionID(id, data);
  }
  @Patch('center/status')
  @ApiBearerAuth()
  @ApiBody({ type: updateCenterStatusReq })
  @ApiCreatedResponse({
    description: '',
    type: updateCenterStatusRes,
  })
  @ApiBearerAuth()
  updateCenterStatus(@Body() data, @Request() req) {
    return this.submissionService.updateCenterStatus(data, req.user);
  }

  @Post('save/:id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: saveResponse,
  })
  @ApiBody({ type: saveReq })
  async save(
    @Param('id') id,
    @Request() req,
    @Body('phase_id') phase_id: number,
  ) {
    const json = await this.getTocs(id);
    return this.submissionService.createNew(
      req.user.id,
      id,
      phase_id,
      JSON.stringify(json),
    );
  }

  @Post('save_result_values/:id')
  @ApiBody({ type: save_result_values_req })
  @ApiBearerAuth()
  async save_result_values(@Param('id') id, @Body() data) {
    return this.submissionService.saveResultData(id, data);
  }
  @Post('save_result_value/:id')
  @ApiBody({ type: save_result_values_req })
  @ApiBearerAuth()
  async save_result_value(@Param('id') id, @Body() data) {
    return this.submissionService.saveResultDataValue(id, data);
  }

  @Post('save_wp_budget/:id')
  @ApiBody({ type: saveWpBudgetReq })
  @ApiBearerAuth()
  async saveWpBudget(@Param('id') id: string, @Body() data: any) {
    return this.submissionService.saveWpBudget(+id, data);
  }

  @Get('wp_budgets/:id/phase/:phaseId')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: getWpBudgets,
  })
  getWpBudgets(@Param('id') id: string, @Param('phaseId') phaseId: string) {
    return this.submissionService.getWpsBudgets(+id, +phaseId);
  }

  @Get('submission_budgets/:id/phase_id/:phase_id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: getWpBudgets,
  })
  getSubmissionBudgets(
    @Param('id') id: string,
    @Param('phase_id') phase_id: string,
  ) {
    return this.submissionService.getSubmissionBudgets(+id, +phase_id);
  }

  @Get('save/:id/phaseId/:phaseId')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: getSaved,
  })
  async getSaved(@Param('id') id, @Param('phaseId') phaseId) {
    return this.submissionService.getSaved(id, phaseId);
  }

  @Get('initiative_id/:initiative_id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: getAll,
  })
  get(@Param('initiative_id') initiative_id, @Query() query) {
    return this.submissionService.findSubmissionsByInitiativeId(
      initiative_id,
      query,
    );
  }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(99999999)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: getTocs,
  })
  @Get('toc/:id')
  async getTocs(@Param('id') id) {
    //?status=publish&order=creation_date&sort_by=DESC&title=&limit=50&page=1&
    const tocs = await firstValueFrom(
      this.httpService
        .get(
          process.env.TOC_API +
            '/flow/search?creation_start=&creation_end=&type=initiative&status=publish&order=creation_date&sort_by=DESC&title=&limit=50&page=1&latest=true',
        )
        .pipe(
          map((d: any) =>
            d.data.data.filter((d: any) => d.initiative_id == id),
          ),
          catchError((error: AxiosError) => {
            console.error(error);
            throw new InternalServerErrorException();
          }),
        ),
    );

    return await firstValueFrom(
      this.httpService
        .get(process.env.TOC_API + '/toc/' + tocs[0].related_flow_id)
        .pipe(
          map((d: any) =>
            d.data.data.filter(
              (d) =>
                ((d.category == 'WP' && !d.group) ||
                  d.category == 'OUTPUT' ||
                  d.category == 'EOI' ||
                  d.category == 'OUTCOME') &&
                d.flow_id == tocs[0].related_flow_id,
            ),
          ),
          catchError((error: AxiosError) => {
            console.error(error);
            throw new InternalServerErrorException();
          }),
        ),
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '',
    type: getbyid,
  })
  getbyid(@Param('id') id) {
    return this.submissionService.findSubmissionsById(id);
  }

  @Get('excel/:id')
  @ApiBearerAuth()
  async excel(@Param('id') id) {
    return await this.submissionService.generateExcel(id, null, null, null);
  }
  @Get('excelCurrent/:id')
  @ApiBearerAuth()
  async excelCurrent(@Param('id') initId) {
    const toc_data = this.getTocs(initId);
    return await this.submissionService.generateExcel(
      null,
      initId,
      toc_data,
      null,
    );
  }
  @Post('excelCurrentCenter')
  @ApiBearerAuth()
  async excelCurrentCenter(@Body() data: any) {
    const toc_data = this.getTocs(data.initId);
    return await this.submissionService.generateExcel(
      null,
      data.initId,
      toc_data,
      data.organization,
    );
  }
}
