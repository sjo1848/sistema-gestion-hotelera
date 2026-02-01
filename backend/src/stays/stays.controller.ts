import { Body, Controller, Post } from '@nestjs/common'
import { StaysService } from './stays.service'
import { CheckInDto } from './dto/check-in.dto'

@Controller('stays')
export class StaysController {
  constructor(private readonly staysService: StaysService) {}

  @Post('check-in')
  checkIn(@Body() dto: CheckInDto) {
    return this.staysService.checkIn(dto.roomId, dto.guestName)
  }
}
