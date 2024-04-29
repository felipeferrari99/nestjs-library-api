import { Field, InputType } from "@nestjs/graphql"
import { IsNumber, IsString, Max, Min } from "class-validator"

@InputType()
export class CreateCommentDTO {
    @Field()
    @IsString()
    body: string

    @Field()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number

    @Field()
    @IsNumber()
    book_id: number
}