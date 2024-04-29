import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"

@InputType()
export class UpdateUserInput {
    @Field()
    @IsEmail()
    @IsOptional()
    email: string

    @Field()
    @IsOptional()
    @IsStrongPassword({
        minLength: 3,
        minNumbers: 0,
        minLowercase: 0,
        minUppercase: 0,
        minSymbols: 0
    })
    password: string

    @Field()
    @IsOptional()
    @IsString()
    image: string

    @Field()
    @IsOptional()
    @IsString()
    description: string
}