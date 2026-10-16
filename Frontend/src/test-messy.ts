import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Headers,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { Lang } from '../../common/decorators/lang.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { I18nService } from '../../common/i18n/i18n.service';

class LoginDto {
  @IsString() @MinLength(9) phone: string;
  @IsString() @MinLength(3) code: string;
}
class RefreshDto {
  @IsString() refreshToken: string;
}
class ChangePasswordDto {
  @IsString() @MinLength(6) oldPassword: string;
  @IsString() @MinLength(6) newPassword: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unified login for admin and guest' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() dto: LoginDto,
    @Lang() lang: 'sw' | 'en',
    @Req() req: Request,
    @Headers('user-agent') ua: string,
  ) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const result = await this.service.login(dto, lang, ip, ua);
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  async logout(@CurrentUser() user: any, @Req() req: Request, @Lang() lang: 'sw' | 'en') {
    if (!user) throw new UnauthorizedException(this.i18n.t('auth.unauthorized', lang));
    return { success: true, message: this.i18n.t('auth.logoutSuccess', lang) };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info' })
  async me(@CurrentUser() user: any, @Lang() lang: 'sw' | 'en') {
    if (!user) throw new UnauthorizedException(this.i18n.t('auth.unauthorized', lang));
    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshDto, @Lang() lang: 'sw' | 'en') {
    if (!dto.refreshToken) {
      throw new BadRequestException(this.i18n.t('auth.refreshRequired', lang));
    }
    const result = await this.service.refresh(dto.refreshToken, lang);
    return result;
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(
    @CurrentUser() user: any,
    @Body() dto: ChangePasswordDto,
    @Lang() lang: 'sw' | 'en',
  ) {
    if (!user) {
      throw new UnauthorizedException(this.i18n.t('auth.unauthorized', lang));
    }
    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException(this.i18n.t('auth.samePassword', lang));
    }
    const result = await this.service.changePassword(
      user.id,
      dto.oldPassword,
      dto.newPassword,
      lang,
    );
    return result;
  }

  @Get('verify-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify if token is still valid' })
  async verifyToken(@CurrentUser() user: any) {
    if (!user) return { valid: false };
    return { valid: true, user: { id: user.id, role: user.role } };
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin authentication stats' })
  async adminStats(@Query('tenantId') tenantId: string, @Lang() lang: 'sw' | 'en') {
    if (!tenantId) {
      throw new BadRequestException(this.i18n.t('auth.tenantRequired', lang));
    }
    const stats = await this.service.getAuthStats(tenantId);
    return stats;
  }

  @Delete('session/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke a session' })
  async revokeSession(
    @CurrentUser() user: any,
    @Param('id') sessionId: string,
    @Lang() lang: 'sw' | 'en',
  ) {
    if (!user) {
      throw new UnauthorizedException(this.i18n.t('auth.unauthorized', lang));
    }
    if (!sessionId) {
      throw new BadRequestException(this.i18n.t('auth.sessionRequired', lang));
    }
    const result = await this.service.revokeSession(user.id, sessionId, lang);
    return result;
  }
}
