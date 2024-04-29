import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"

@InputType()
export class UpdateBookInput {
    @Field()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title: string

    @Field()
    @IsOptional()
    @IsString()
    release_date: string

    @Field()
    @IsOptional()
    @IsString()
    image: string

    @Field()
    @IsOptional()
    @IsString()
    authorName: string

    @Field()
    @IsOptional()
    @IsNumber()
    @Min(0)
    qty_available: number

    @Field()
    @IsOptional()
    @IsNumber()
    author_id: number

    @Field()
    @IsOptional()
    @IsString()
    description: string
}