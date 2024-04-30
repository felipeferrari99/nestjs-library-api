import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AuthorType } from "../../author/types/author.type";
import { CommentType } from "../../comment/types/comment.type";

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

    @Field({ nullable: true })
    description: string;

    @Field(type => [CommentType], { nullable: true })
    comments?: CommentType;

    @Field(type => AuthorType)
    author?: AuthorType
}