import { Field, ID, ObjectType } from "@nestjs/graphql";
import { UserType } from "../../user/type/user.type";
import { BookType } from "../../book/types/book.type";

@ObjectType()
export class RentType {
    @Field(() => ID)
    id: number;

    @Field()
    date_for_return: string;

    @Field({ nullable: true })
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