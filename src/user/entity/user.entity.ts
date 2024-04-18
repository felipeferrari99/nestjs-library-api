import { Books } from "src/book/entity/book.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @ManyToOne(() => Books, books => books.favorite)
    @JoinColumn({ name: 'favorite_book' })
    books: Books
}