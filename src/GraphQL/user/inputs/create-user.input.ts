import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"

@InputType()
export class CreateUserInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    username: string

    @Field()
    @IsEmail()
    email: string

    @Field()
    @IsStrongPassword({
        minLength: 3,
        minNumbers: 0,
        minLowercase: 0,
        minUppercase: 0,
        minSymbols: 0
    })
    password: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    image: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description: string
}