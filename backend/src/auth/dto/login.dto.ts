import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@paloalto.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin_password_123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
