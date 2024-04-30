import { ArgsType, Field } from "@nestjs/graphql";
import { CreateAuthorInput } from "../inputs/create-author.input";

@ArgsType()
export class CreateAuthorArgs {
    @Field()
    data: CreateAuthorInput
}