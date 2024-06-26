import { Books } from "../../book/entity/book.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
require('dotenv').config();

@Entity()
export class Authors {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        default: process.env.CLOUDINARY_PROFILE_URL
    })
    image: string;

    @Column({
        nullable: true
    })
    description: string;

    @OneToMany(type => Books, book => book.author)
    books: Books[];
}