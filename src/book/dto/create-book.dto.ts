import { IsDate, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class CreateBookDTO {
    @IsString()
    title: string

    @IsDate()
    release_date: string

    @IsString()
    image: string

    @IsNumber()
    qty_available: number

    @IsNumber()
    author_id: number

    @IsOptional()
    @IsString()
    description: string
}