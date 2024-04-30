import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BookType } from "src/book/type/book.type";

@ObjectType()
export class AuthorType {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    image: string;

    @Field()
    description: string;

    @Field(type => BookType)
    books?: BookType;
}