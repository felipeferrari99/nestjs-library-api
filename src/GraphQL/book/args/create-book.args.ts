import { ArgsType, Field } from "@nestjs/graphql";
import { CreateBookInput } from "../inputs/create-book.input";

@ArgsType()
export class CreateBookArgs {
    @Field()
    data: CreateBookInput
}