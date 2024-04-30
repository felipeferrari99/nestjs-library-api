import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Users } from "../../../user/entity/user.entity";
import { BookType } from "../../book/types/book.type";

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

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  favorite_book: number; 

  @Field(type => BookType, { nullable: true })
  book?: BookType;
}