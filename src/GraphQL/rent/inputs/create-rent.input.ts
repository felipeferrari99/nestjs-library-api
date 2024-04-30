import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateRentInput {
    @Field()
    @IsNotEmpty()
    @IsNumber()
    book_id: number;

    @Field()
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @Field({ nullable: true }) 
    @IsOptional()
    @IsString()
    date_returned: string;
}
