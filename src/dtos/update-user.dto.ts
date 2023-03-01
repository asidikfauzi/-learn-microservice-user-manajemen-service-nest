import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'email not provided' })
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'username not provided' })
  public username: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty({ message: 'role not provided' })
  public role_id: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty({ message: 'Is active not provided' })
  public is_active: boolean;
}