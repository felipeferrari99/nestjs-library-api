import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDTO } from "./dto/create-book.dto";

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Post()
    async create(@Body() data: CreateBookDTO) {
        return this.bookService.create(data);
    }

    @Get()
    async list() {
        return this.bookService.list();
    }

    @Get(':id')
    async show(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.show(id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return {
            success: await this.bookService.delete(id),
        };
    }
}