import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BookType } from "../../book/types/book.type";

@ObjectType()
export class AuthorType {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    image: string;

    @Field({ nullable: true })
    description: string;

    @Field(type => [BookType], { nullable: true })
    books?: BookType;
}