import { Body, Controller, Get, Post, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthRequest } from './types/auth-request';
import type { Response } from 'express';

const authErrorExample = {
  code: 'AUTH_UNAUTHORIZED',
  message: 'Invalid credentials',
  details: {},
  traceId: 'req-123',
  path: '/api/v1/auth/login',
  timestamp: '2026-02-03T03:40:00.000Z',
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register user and return JWT' })
  @ApiResponse({ status: 200, description: 'User registered' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and return JWT' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials', example: authErrorExample })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user info' })
  @ApiResponse({ status: 401, description: 'Unauthorized', example: authErrorExample })
  async me(@Req() req: AuthRequest) {
    return this.authService.me(req.user?.id ?? '');
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token (uses HttpOnly cookie)' })
  @ApiResponse({ status: 200, description: 'New access token' })
  @ApiResponse({ status: 401, description: 'Missing or invalid refresh token', example: authErrorExample })
  async refresh(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refreshToken;
    if (!token) throw new UnauthorizedException('Missing refresh token');
    const payload = await this.authService.verifyRefreshToken(token);
    const result = await this.authService.refresh(payload.sub, token);
    this.setRefreshCookie(res, result.refreshToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and clear refresh cookie' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  async logout(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user?.id ?? '');
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    return { ok: true };
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/v1/auth/refresh',
    });
  }
}
