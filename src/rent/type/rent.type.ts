import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BookType } from "src/book/type/book.type";
import { UserType } from "src/user/type/user.type";

@ObjectType()
export class RentType {
    @Field(() => ID)
    id: number;

    @Field()
    date_for_return: string;

    @Field()
    date_returned: string;

    @Field()
    status: string;

    @Field()
    book_id: number;

    @Field()
    user_id: number;

    @Field()
    date_rented: string;

    @Field(type => UserType)
    user?: UserType

    @Field(type => BookType)
    book?: BookType
}