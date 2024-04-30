import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"

@InputType()
export class UpdateBookInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    release_date: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    image: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    authorName: string

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    qty_available: number

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    author_id: number

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description: string
}