import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

@InputType()
export class UpdateAuthorInput {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Field({ nullable: true })
    name: string

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    image: string

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    description: string
}