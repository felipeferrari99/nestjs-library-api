import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"

@InputType()
export class CreateBookInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    title: string

    @Field()
    @IsString()
    release_date: string

    @Field()
    @IsOptional()
    @IsString()
    image: string

    @Field()
    @IsNumber()
    @Min(0)
    qty_available: number

    @Field()
    @IsString()
    authorName: string

    @Field()
    @IsOptional()
    @IsNumber()
    author_id: number

    @Field()
    @IsOptional()
    @IsString()
    description: string
}