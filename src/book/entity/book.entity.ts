import { Authors } from "src/author/entity/author.entity";
import { Users } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
require('dotenv').config();

@Entity()
export class Books {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type: 'date'
    })
    release_date: string;

    @Column({
        default: process.env.CLOUDINARY_BOOK_URL
    })
    image: string;

    @Column()
    qty_available: number;

    @Column()
    author: number;

    @Column({
        nullable: true
    })
    description: string;

    @OneToMany(type => Users, users => users.favorite_book)
    favorite: Books[];

    @ManyToOne(() => Authors, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author' })
    authors: Authors
}
