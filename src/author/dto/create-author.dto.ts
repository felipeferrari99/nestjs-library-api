import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateAuthorDTO {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    image: string

    @IsOptional()
    @IsString()
    description: string
}