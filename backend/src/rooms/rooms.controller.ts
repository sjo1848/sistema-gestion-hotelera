import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  UseGuards,
} from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { UpdateRoomStatusDto } from './dto/update-room-status.dto'
import { CreateRoomDto } from './dto/create-room.dto'
import { CheckInDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  findAll() {
    return this.roomsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id)
  }

  @Post()
  @Roles('ADMIN')
create(@Body() dto: CreateRoomDto) {
  return this.roomsService.create(dto)
}

  @Post(':id/check-in')
checkIn(
  @Param('id') id: string,
  @Body() dto: CheckInDto,
) {
  return this.roomsService.checkIn(id, dto.guestName);
}

  @Post(':id/check-out')
  @HttpCode(200)
checkOut(@Param('id') id: string) {
  return this.roomsService.checkOut(id);
}

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id)
  }

  @Post(':id/clean')
  @HttpCode(200)
markAsClean(@Param('id') id: string) {
  return this.roomsService.markAsClean(id);
}

  @Post(':id/maintenance')
  @HttpCode(200)
sendToMaintenance(@Param('id') id: string) {
  return this.roomsService.sendToMaintenance(id);
}

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRoomStatusDto,
  ) {
    return this.roomsService.updateStatus(id, dto.status)
  }
}
