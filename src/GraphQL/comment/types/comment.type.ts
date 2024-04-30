import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BookType } from "../../book/types/book.type";
import { UserType } from "../../user/type/user.type";

@ObjectType()
export class CommentType {
    @Field(() => ID)
    id: number;

    @Field()
    body: string;

    @Field()
    rating: number;

    @Field()
    book_id: number;

    @Field()
    user_id: number;

    @Field(type => UserType)
    user?: UserType

    @Field(type => BookType)
    books?: BookType
}
