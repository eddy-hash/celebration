import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Lang } from '../../common/decorators/lang.decorator';

class UnifiedLoginDto {
  @IsString() @MinLength(9)
  phone: string;

  @IsString() @MinLength(3)
  code: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  login(
    @Body() dto: UnifiedLoginDto,
    @Lang() lang: 'sw' | 'en',
    @Req() req: Request,
  ) {
    return this.service.login(
      dto,
      lang,
      req.ip || req.socket.remoteAddress,
      req.headers['user-agent'],
    );
  }
}
