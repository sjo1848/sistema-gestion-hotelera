import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { StaysService } from './stays.service';
import { CheckInDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('stays')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaysController {
  constructor(private readonly staysService: StaysService) {}

  @Post('check-in')
  async checkIn(@Body() dto: CheckInDto) {
    return this.staysService.checkIn(
      dto.roomId,
      dto.guestName,
      new Date(), // check-in at "now"
    );
  }
}
