import { Books } from "../../book/entity/book.entity";
import { Users } from "../../user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    Active = 'active',
    Returned = 'returned',
    Late = 'late'
  }

@Entity()
export class Rents {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'date'
    })
    date_for_return: string;

    @Column({
        type: 'date',
        nullable: true
    })
    date_returned: string;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.Active
    })
    status: string;

    @Column()
    book_id: number;

    @Column()
    user_id: number;

    @CreateDateColumn()
    date_rented: string;

    @ManyToOne(() => Users, user => user.rents)
    @JoinColumn({ name: 'user_id' })
    user: Users

    @ManyToOne(() => Books, books => books.rents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'book_id' })
    book: Books
}