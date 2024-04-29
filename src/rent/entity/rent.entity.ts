import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Books } from "../../book/entity/book.entity";
import { Users } from "../../user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    Active = 'active',
    Returned = 'returned',
    Late = 'late'
}

@ObjectType()
@Entity()
export class Rents {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column({
        type: 'date'
    })
    @Field()
    date_for_return: string;

    @Column({
        type: 'date',
        nullable: true
    })
    @Field()
    date_returned: string;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.Active
    })
    @Field()
    status: string;

    @Column()
    @Field()
    book_id: number;

    @Column()
    @Field()
    user_id: number;

    @CreateDateColumn()
    @Field()
    date_rented: string;

    @ManyToOne(() => Users, user => user.rents)
    @JoinColumn({ name: 'user_id' })
    user: Users

    @ManyToOne(() => Books, books => books.rents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'book_id' })
    book: Books
}