import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Books } from "../../book/entity/book.entity";
import { Users } from "../../user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field()
    @Column()
    body: string;

    @Field()
    @Column()
    rating: number;

    @Field()
    @Column()
    book_id: number;

    @Field()
    @Column()
    user_id: number;

    @ManyToOne(() => Users, user => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: Users

    @ManyToOne(() => Books, books => books.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'book_id' })
    books: Books
}
