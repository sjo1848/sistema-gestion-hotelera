import { IsNotEmpty, IsString } from 'class-validator'

export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  roomId: string

  @IsString()
  @IsNotEmpty()
  guestName: string
}
