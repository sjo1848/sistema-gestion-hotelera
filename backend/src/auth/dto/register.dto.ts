import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'staff@paloalto.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Staff Hotel' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'staff_password_123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'STAFF', required: false })
  @IsOptional()
  @IsString()
  role?: string;
}
