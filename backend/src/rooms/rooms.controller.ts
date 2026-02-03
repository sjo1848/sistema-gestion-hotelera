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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RoomsService } from './rooms.service'
import { UpdateRoomStatusDto } from './dto/update-room-status.dto'
import { CreateRoomDto } from './dto/create-room.dto'
import { CheckInDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @ApiOperation({ summary: 'List rooms' })
  @ApiResponse({ status: 200, description: 'Rooms list' })
  findAll() {
    return this.roomsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by id' })
  @ApiResponse({ status: 200, description: 'Room detail' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id)
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create room (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Room created' })
create(@Body() dto: CreateRoomDto) {
  return this.roomsService.create(dto)
}

  @Post(':id/check-in')
  @ApiOperation({ summary: 'Check-in by room id' })
  @ApiResponse({ status: 200, description: 'Stay created' })
checkIn(
  @Param('id') id: string,
  @Body() dto: CheckInDto,
) {
  return this.roomsService.checkIn(id, dto.guestName);
}

  @Post(':id/check-out')
  @HttpCode(200)
  @ApiOperation({ summary: 'Check-out by room id' })
  @ApiResponse({ status: 200, description: 'Stay closed' })
checkOut(@Param('id') id: string) {
  return this.roomsService.checkOut(id);
}

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete room (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Room deleted' })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id)
  }

  @Post(':id/clean')
  @HttpCode(200)
  @ApiOperation({ summary: 'Mark room as clean' })
  @ApiResponse({ status: 200, description: 'Room updated' })
markAsClean(@Param('id') id: string) {
  return this.roomsService.markAsClean(id);
}

  @Post(':id/maintenance')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send room to maintenance' })
  @ApiResponse({ status: 200, description: 'Room updated' })
sendToMaintenance(@Param('id') id: string) {
  return this.roomsService.sendToMaintenance(id);
}

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update room status' })
  @ApiResponse({ status: 200, description: 'Room updated' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRoomStatusDto,
  ) {
    return this.roomsService.updateStatus(id, dto.status)
  }
}
