import { Books } from "src/book/entity/book.entity";
import { Comments } from "src/comment/entity/comment.entity";
import { Rents } from "src/rent/entity/rent.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
require('dotenv').config();

export enum UserType {
  User = 'user',
  Admin = 'admin',
}

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    username: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserType,
        default: UserType.User
    })
    type: string;

    @Column({
        default: process.env.CLOUDINARY_PROFILE_URL
    })
    image: string;

    @Column({
        nullable: true
    })
    description: string;

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