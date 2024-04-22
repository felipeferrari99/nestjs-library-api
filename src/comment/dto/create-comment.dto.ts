import { IsNumber, IsString, Max, Min } from "class-validator"

export class CreateCommentDTO {
    @IsString()
    body: string

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number

    @IsNumber()
    book_id: number
}