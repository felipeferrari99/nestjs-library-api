import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateRentDTO {
    @IsNotEmpty()
    @IsNumber()
    book_id: number

    @IsNotEmpty()
    @IsNumber()
    user_id: number

    @IsOptional()
    @IsString()
    date_returned: string
}