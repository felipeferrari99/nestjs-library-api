import { Injectable, NotFoundException } from "@nestjs/common";
import { Authors } from "./entity/author.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAuthorDTO } from "./dto/create-author.dto";

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Authors)
        private authorsRepository: Repository<Authors>
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
        await this.authorsRepository.findOne({
            where: { id },
            relations: ["books"]
        })
        console.log('fkfdjkkdfdl')
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