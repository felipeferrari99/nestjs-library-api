import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDTO {
    @IsString()
    username: string

    @IsEmail()
    email: string

    @IsStrongPassword({
        minLength: 3,
        minNumbers: 0,
        minLowercase: 0,
        minUppercase: 0,
        minSymbols: 0
    })
    password: string

    @IsOptional()
    @IsString()
    image: string

    @IsOptional()
    @IsString()
    description: string
}