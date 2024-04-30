import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Users } from "../entity/user.entity";
import { BookType } from "src/book/type/book.type";
import { RentType } from "src/rent/type/rent.type";
import { CommentType } from "src/comment/type/comment.type";

@ObjectType()
export class CreateUserResponse {
  @Field(() => Users)
  user: Users;

  @Field()
  token: string;
}

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  type: string;

  @Field()
  image: string;

  @Field()
  description: string;

  @Field()
  favorite_book: number; 

  @Field(type => CommentType)
  comments?: CommentType;

  @Field(type => RentType)
  rents?: RentType;

  @Field(type => BookType)
  book?: BookType;
}