import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AuthorType } from "src/author/type/author.type";
import { CommentType } from "src/comment/type/comment.type";
import { RentType } from "src/rent/type/rent.type";

@ObjectType()
export class BookType {
    @Field(() => ID)
    id: number;

    @Field()
    title: string;

    @Field()
    release_date: string;

    @Field()
    image: string;

    @Field()
    qty_available: number;

    @Field()
    author_id: number;

    @Field()
    description: string;

    @Field(type => BookType)
    favorite?: BookType

    @Field(type => CommentType)
    comments?: CommentType

    @Field(type => RentType)
    rents?: RentType

    @Field(type => AuthorType)
    author?: AuthorType
}