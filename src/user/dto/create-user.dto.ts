import { IsEmail, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator"

export class CreateUserDTO {
    @IsString()
    @MinLength(1)
    username: string

    @IsEmail()
    @MinLength(1)
    email: string

    @IsStrongPassword({
        minLength: 3,
        minNumbers: 0,
        minLowercase: 0,
        minUppercase: 0,
        minSymbols: 0
    })
    password: string

    @IsString()
    image: string

    @IsOptional()
    @IsString()
    description: string

}