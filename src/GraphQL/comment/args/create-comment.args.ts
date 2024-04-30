import { ArgsType, Field } from "@nestjs/graphql";
import { CreateCommentInput } from "../inputs/create-comment.input";

@ArgsType()
export class CreateCommentArgs {
    @Field()
    data: CreateCommentInput
}