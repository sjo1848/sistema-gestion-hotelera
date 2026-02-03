import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StaysService } from './stays.service';
import { CheckInDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Stays')
@ApiBearerAuth()
@Controller('stays')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaysController {
  constructor(private readonly staysService: StaysService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Check-in with roomId in body' })
  @ApiResponse({ status: 200, description: 'Stay created' })
  async checkIn(@Body() dto: CheckInDto) {
    return this.staysService.checkIn(
      dto.roomId,
      dto.guestName,
      new Date(), // check-in at "now"
    );
  }
}
