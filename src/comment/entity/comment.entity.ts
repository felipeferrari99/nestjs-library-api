import { Books } from "../../book/types/book.entity";
import { Users } from "../../user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comments {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @Column()
    rating: number;

    @Column()
    book_id: number;

    @Column()
    user_id: number;

    @ManyToOne(() => Users, user => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: Users

    @ManyToOne(() => Books, books => books.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'book_id' })
    books: Books
}
