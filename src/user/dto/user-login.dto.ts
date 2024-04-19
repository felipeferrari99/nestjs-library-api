import { IsString, MinLength } from 'class-validator';

export class UserLoginDTO {
  @IsString()
  username: string;

  @IsString()
  @MinLength(3)
  password: string;
}