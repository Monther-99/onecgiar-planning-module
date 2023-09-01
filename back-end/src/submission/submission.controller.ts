import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
@Controller('submission')
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly httpService: HttpService,
  ) {}

  @Patch('status/:id')
  updateStatus(@Param('id') id, @Body() data) {
    return this.submissionService.updateStatusBySubmittionID(id, data);
  }

  @Post('save/:id')
  async save(@Param('id') id) {
    const json = await this.getTocs(id);
    return this.submissionService.createNew(1, id, 2, JSON.stringify(json));
  }

  @Get('import')
  import() {
    this.submissionService.importData();
    return 'Data imported successfully';
  }
  @Post('save_result_values/:id')
  async save_result_values(@Param('id') id, @Body() data) {
    return this.submissionService.saveResultData(id, data);
  }
  @Post('save_result_value/:id')
  async save_result_value(@Param('id') id, @Body() data) {
    return this.submissionService.saveResultDataValue(id, data);
  }

  @Get('save/:id')
  async getSaved(@Param('id') id) {
    return this.submissionService.getSaved(id);
  }
  @Get('initiative_id/:initiative_id')
  get(@Param('initiative_id') initiative_id) {
    return this.submissionService.findSubmissionsByInitiativeId(initiative_id);
  }

  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(99999)
  // @Get('toc/:id')
  // async getToc(@Param('id') id) {
  //   return await firstValueFrom(
  //     this.httpService.get('https://toc.mel.cgiar.org/api/toc/' + id).pipe(
  //       map((d: any) =>
  //         d.data.data.filter(
  //           (d) =>
  //             (d.category == 'WP' && !d.group) ||
  //             d.category == 'OUTPUT' ||
  //             (d.category == 'OUTCOME' && d.flow_id == id),
  //         ),
  //       ),
  //       catchError((error: AxiosError) => {
  //         console.error(error);
  //         throw new InternalServerErrorException();
  //       }),
  //     ),
  //   );
  // }

  @UseInterceptors(CacheInterceptor)
  @CacheTTL(99999999)
  @Get('toc/:id')
  async getTocs(@Param('id') id) {
    //?status=publish&order=creation_date&sort_by=DESC&title=&limit=50&page=1&
    const tocs = await firstValueFrom(
      this.httpService
        .get(
          'https://toc.mel.cgiar.org/api/flow/search?creation_start=&creation_end=&type=initiative&status=publish&order=creation_date&sort_by=DESC&title=&limit=50&page=1&latest=true',
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
        .get('https://toc.mel.cgiar.org/api/toc/' + tocs[0].related_flow_id)
        .pipe(
          map((d: any) =>
            d.data.data.filter(
              (d) =>
                (d.category == 'WP' && !d.group) ||
                d.category == 'OUTPUT' ||
                d.category == 'EOI' ||
                (d.category == 'OUTCOME' && d.flow_id == id),
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
  getbyid(@Param('id') id) {
    return this.submissionService.findSubmissionsById(id);
  }
}
