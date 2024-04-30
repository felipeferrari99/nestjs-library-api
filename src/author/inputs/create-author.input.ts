import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

@InputType()
export class CreateAuthorInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    image: string

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description: string
}