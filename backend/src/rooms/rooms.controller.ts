import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { RoomsService } from './rooms.service'
import { UpdateRoomStatusDto } from './dto/update-room-status.dto'
import { CreateRoomDto } from './dto/create-room.dto'

@Controller('rooms')
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
create(@Body() dto: CreateRoomDto) {
  return this.roomsService.create(dto)
}


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id)
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRoomStatusDto,
  ) {
    return this.roomsService.updateStatus(id, dto.status)
  }
}
