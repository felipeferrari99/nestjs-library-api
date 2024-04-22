import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateRentDTO {
    @IsNumber()
    book_id: number

    @IsNumber()
    user_id: number

    @IsOptional()
    @IsString()
    date_returned: string
}