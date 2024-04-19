import { Injectable, NotFoundException } from "@nestjs/common";
import { Authors } from "./entity/author.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAuthorDTO } from "./dto/create-author.dto";
import { Books } from "src/book/entity/book.entity";

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Authors)
        private authorsRepository: Repository<Authors>,
        @InjectRepository(Books)
        private booksRepository: Repository<Books>
    ) {}

    async create(data: CreateAuthorDTO) {
        const author = this.authorsRepository.create(data)
        return this.authorsRepository.save(author)
    }

    async list() {
        return this.authorsRepository.find()
    }

    async show(id: number) {
        await this.exists(id);
        return this.authorsRepository.findOne({
            where: { id: id },
            relations: ["books"]
        })
    }

    async exists(id: number) {
        if (
            !(await this.authorsRepository.exists({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`The author with id ${id} does not exist`);
        }
    }
}