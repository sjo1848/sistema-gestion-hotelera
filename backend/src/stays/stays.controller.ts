import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StaysService } from './stays.service';
import { CheckInDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const staysErrorExample = {
  code: 'RESOURCE_CONFLICT',
  message: 'There is already an active stay for this room',
  details: {},
  traceId: 'req-123',
  path: '/api/v1/stays/check-in',
  timestamp: '2026-02-03T03:40:00.000Z',
};

@ApiTags('Stays')
@ApiBearerAuth()
@Controller('stays')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaysController {
  constructor(private readonly staysService: StaysService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check-in with roomId in body' })
  @ApiResponse({ status: 200, description: 'Stay created' })
  @ApiResponse({ status: 401, description: 'Unauthorized', example: staysErrorExample })
  @ApiResponse({ status: 404, description: 'Room not found', example: staysErrorExample })
  @ApiResponse({ status: 409, description: 'Conflict', example: staysErrorExample })
  async checkIn(@Body() dto: CheckInDto) {
    return this.staysService.checkIn(
      dto.roomId,
      dto.guestName,
      new Date(), // check-in at "now"
    );
  }
}
