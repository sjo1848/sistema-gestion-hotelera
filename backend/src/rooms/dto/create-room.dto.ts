import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { RoomStatus } from '@prisma/client'

export class CreateRoomDto {
  @ApiProperty({ example: '301' })
  @IsString()
  @IsNotEmpty()
  number: string

  @ApiProperty({ example: 'Suite' })
  @IsString()
  @IsNotEmpty()
  type: string

  @ApiProperty({ example: 120 })
  @IsNumber()
  price: number

  @ApiProperty({ example: 'AVAILABLE', required: false })
  @IsEnum(RoomStatus)
  status?: RoomStatus
}
