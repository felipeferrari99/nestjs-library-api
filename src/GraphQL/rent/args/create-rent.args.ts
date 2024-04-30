import { ArgsType, Field } from "@nestjs/graphql";
import { CreateRentInput } from "../inputs/create-rent.input";

@ArgsType()
export class CreateRentArgs {
    @Field()
    data: CreateRentInput
}