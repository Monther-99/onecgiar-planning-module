import { Controller, Get } from '@nestjs/common';

@Controller('helth')
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Good';;
  }
}
