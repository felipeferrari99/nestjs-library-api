import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class UserLoginInput {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  @MinLength(3)
  password: string;
}