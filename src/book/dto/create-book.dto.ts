import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator"

export class CreateBookDTO {
    @IsString()
    title: string

    @IsString()
    release_date: string

    @IsOptional()
    @IsString()
    image: string

    qty_available: number

    @IsString()
    authorName: string

    @IsOptional()
    @IsNumber()
    author_id: number

    @IsOptional()
    @IsString()
    description: string
}