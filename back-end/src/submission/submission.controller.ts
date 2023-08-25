import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
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

  @Get('import')
  import() {
    this.submissionService.importData();
    return 'Data imported successfully';
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
}
