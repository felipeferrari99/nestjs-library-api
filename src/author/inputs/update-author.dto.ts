import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

@InputType()
export class UpdateAuthorDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Field()
    name: string

    @IsOptional()
    @IsString()
    @Field()
    image: string

    @IsOptional()
    @IsString()
    @Field()
    description: string
}