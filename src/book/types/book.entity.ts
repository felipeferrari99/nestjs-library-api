import { Field, ID } from "@nestjs/graphql";
import { Authors } from "../../author/types/author.entity";
import { Comments } from "../../comment/entity/comment.entity";
import { Rents } from "../../rent/entity/rent.entity";
import { Users } from "../../user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
require('dotenv').config();

@Entity()
export class Books {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    title: string;

    @Column({
        type: 'date'
    })
    @Field()
    release_date: string;

    @Column({
        default: process.env.CLOUDINARY_BOOK_URL
    })
    @Field()
    image: string;

    @Column({
        default: 0
    })
    @Field()
    qty_available: number;

    @Column()
    @Field()
    author_id: number;

    @Column({
        nullable: true
    })
    @Field()
    description: string;

    @OneToMany(type => Users, users => users.favorite_book)
    favorite: Books[];

    @OneToMany(type => Comments, comment => comment.books)
    comments: Comments[];

    @OneToMany(type => Rents, rent => rent.book)
    rents: Rents[];

    @ManyToOne(() => Authors, author => author.books, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author: Authors
}