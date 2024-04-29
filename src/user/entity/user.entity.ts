import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Books } from "../../book/entity/book.entity";
import { Comments } from "../../comment/entity/comment.entity";
import { Rents } from "../../rent/entity/rent.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
require('dotenv').config();

export enum UserType {
  User = 'user',
  Admin = 'admin',
}

@ObjectType()
@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field()
    @Column({
        unique: true,
    })
    username: string;

    @Field()
    @Column({
        unique: true,
    })
    email: string;

    @Field()
    @Column()
    password: string;

    @Field()
    @Column({
        type: "enum",
        enum: UserType,
        default: UserType.User
    })
    type: string;

    @Field()
    @Column({
        default: process.env.CLOUDINARY_PROFILE_URL
    })
    image: string;

    @Field()
    @Column({
        nullable: true
    })
    description: string;

    @Field()
    @Column({
        nullable: true
    })
    favorite_book: number; 

    @OneToMany(type => Comments, comment => comment.user)
    comments: Comments[];

    @OneToMany(type => Rents, rent => rent.user)
    rents: Rents[];

    @ManyToOne(() => Books, books => books.favorite, {onDelete: 'SET NULL'})
    @JoinColumn({ name: 'favorite_book' })
    book: Books
}