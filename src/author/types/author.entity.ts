import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Books } from "../../book/types/book.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
require('dotenv').config();

@ObjectType()
@Entity()
export class Authors {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column({
        default: process.env.CLOUDINARY_PROFILE_URL
    })
    @Field()
    image: string;

    @Column({
        nullable: true
    })
    @Field()
    description: string;

    @OneToMany(type => Books, book => book.author)
    books: Books[];
}