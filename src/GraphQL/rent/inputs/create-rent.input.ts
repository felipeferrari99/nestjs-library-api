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

    @Field()
    @IsNotEmpty()
    @IsString()
    date_rented: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    date_for_return: string;

    @Field({ nullable: true }) 
    @IsOptional()
    @IsString()
    date_returned: string;
}
