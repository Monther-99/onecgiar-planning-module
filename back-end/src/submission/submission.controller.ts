import { Controller, Get } from '@nestjs/common';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Get('import')
  import() {
    this.submissionService.importData();
    return 'Data imported successfully';
  }
}
