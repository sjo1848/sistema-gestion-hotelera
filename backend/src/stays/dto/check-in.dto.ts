import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CheckInDto {
  @ApiProperty({ example: 'room_id' })
  @IsString()
  @IsNotEmpty()
  roomId: string

  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  @IsNotEmpty()
  guestName: string
}
