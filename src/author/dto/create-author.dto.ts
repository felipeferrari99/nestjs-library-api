import { IsOptional, IsString } from "class-validator"

export class CreateAuthorDTO {
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    image: string

    @IsOptional()
    @IsString()
    description: string
}