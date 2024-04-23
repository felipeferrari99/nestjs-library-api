import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDTO } from "./dto/create-book.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateBookDTO } from "./dto/update-book.dto";
import { AuthorService } from "src/author/author.service";

@Controller('books')
export class BookController {
    constructor(
        private readonly bookService: BookService,
        private readonly authorService: AuthorService
    ) {}

    @Post()
    async create(@Body() data: CreateBookDTO) {
        const authorData = await this.authorService.getByName(data.authorName)
        if (data.release_date == 'Invalid date') {
            throw new BadRequestException('Insert a valid date.');
        }
        if (!authorData) {
            const newAuthor = await this.authorService.create({'name': data.authorName, 'image': null, 'description': null})
            data.author_id = newAuthor.id;
        } 
        if (authorData) {
            data.author_id = authorData.id
        }
        return this.bookService.create(data);
    }

    @Get()
    async list(@Query('search') search: string) {
        return this.bookService.list(search);
    }

    @Get(':id')
    async show(@Param('id', ParseIntPipe) id: number) {
        return this.bookService.show(id);
    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdateBookDTO, @Param('id', ParseIntPipe) id: number) {
        const authorData = await this.authorService.getByName(data.authorName)
        if (!authorData) {
            const newAuthor = await this.authorService.create({'name': data.authorName, 'image': null, 'description': null})
            data.author_id = newAuthor.id;
        } 
        if (authorData) {
            data.author_id = authorData.id
        }
        return this.bookService.updatePartial(id, data);
    }

    @Post(':id/image')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        const image = file;
        return this.bookService.updateImage(id, image)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return {
            success: await this.bookService.delete(id),
        };
    }
}