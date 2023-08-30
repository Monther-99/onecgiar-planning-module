import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
class AuthCode {
  @ApiProperty()
  code: string;
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('AWS'))
  @Post('aws')
  awsAuth(@Request() req, @Body() authCode: AuthCode) {
    return req.user;
  }
}
