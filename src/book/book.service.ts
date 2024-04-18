import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Books } from "./entity/book.entity";
import { Repository } from "typeorm";

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Books)
        private booksRepository: Repository<Books>
    ) {}
}