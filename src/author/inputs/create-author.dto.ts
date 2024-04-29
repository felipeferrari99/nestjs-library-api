import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

@InputType()
export class CreateAuthorDTO {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string

    @Field()
    @IsOptional()
    @IsString()
    image: string

    @Field()
    @IsOptional()
    @IsString()
    description: string
}