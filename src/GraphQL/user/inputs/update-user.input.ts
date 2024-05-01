import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator"

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @IsEmail()
    @IsOptional()
    email: string

    @Field({ nullable: true })
    @IsOptional()
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