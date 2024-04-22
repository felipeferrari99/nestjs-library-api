import { Injectable, NotFoundException } from "@nestjs/common";
import { Rents } from "./entity/rent.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRentDTO } from "./dto/create-rent.dto";
import { BookService } from "src/book/book.service";

@Injectable()
export class RentsService{
    constructor(
        @InjectRepository(Rents)
        private rentsRepository: Repository<Rents>,
        private readonly booksService: BookService,
    ) {}

    async create(data: CreateRentDTO) {
        const book = await this.booksService.show(data.book_id);
        book.qty_available = book.qty_available - 1;
        await this.booksService.updatePartial(data.book_id, book)
        const rent = this.rentsRepository.create(data)
        return this.rentsRepository.save(rent)
    }

    async show(userId: number) {
        return this.rentsRepository.find({
            where: { user_id: userId },
            relations: ['book']
        });
    }

    async list() {
        return this.rentsRepository.find({
            relations: ['book', 'user']
        });
    }

    async returnBook(id: number) {
        const rent = await this.rentsRepository.findOne({where: { id }});
        const book = await this.booksService.show(rent.book_id);
        book.qty_available += 1;
        await this.booksService.updatePartial(rent.book_id, book)
        return(rent)
    }

    async saveReturn(id: number, rent: Rents) {
        return await this.rentsRepository.save(rent);
    }

    async exists(id: number) {
        if (
            !(await this.rentsRepository.exists({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`The rent with id ${id} does not exist`);
        }
    }
}