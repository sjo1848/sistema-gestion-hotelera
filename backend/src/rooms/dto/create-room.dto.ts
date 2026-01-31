import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { RoomStatus } from '@prisma/client'

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  number: string

  @IsString()
  @IsNotEmpty()
  type: string

  @IsNumber()
  price: number

  @IsEnum(RoomStatus)
  status?: RoomStatus
}
