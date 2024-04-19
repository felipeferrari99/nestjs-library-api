import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Books } from "./entity/book.entity";
import { Repository } from "typeorm";
import { CreateBookDTO } from "./dto/create-book.dto";

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Books)
        private booksRepository: Repository<Books>
    ) {}

    async create(data: CreateBookDTO) {
        const book = this.booksRepository.create(data)
        return this.booksRepository.save(book)
    }

    async list() {
        return this.booksRepository.find({
            relations: ["author"]
        })
    }

    async show(id: number) {
        await this.exists(id);
        return this.booksRepository.findOne({
            where: { id },
            relations: ["author", "comments"]
        })
    }

    async delete(id: number) {
        await this.exists(id);
        await this.booksRepository.delete(id);
        return true;
    }

    async exists(id: number) {
        if (
            !(await this.booksRepository.exists({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`The book with id ${id} does not exist`);
        }
    }
}