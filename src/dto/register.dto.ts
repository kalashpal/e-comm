import { IsNotEmpty, IsString, IsEmail, IsArray } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsArray()
  roles: string[]; // Assuming roles will be passed as an array of strings
}
