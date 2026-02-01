import { IsString, IsUUID } from 'class-validator'

export class CheckInDto {
  @IsUUID()
  roomId: string

  @IsString()
  guestName: string
}
