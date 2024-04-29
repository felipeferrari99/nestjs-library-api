import { BadRequestException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BookService } from "../book.service";
import { CreateBookDTO } from "../inputs/create-book.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateBookDTO } from "../inputs/update-book.dto";
import { AuthorService } from "../../author/author.service";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { Books } from "../types/book.entity";

@Resolver('books')
export class BookResolver {
    constructor(
        private readonly bookService: BookService,
        private readonly authorService: AuthorService
    ) {}

    @Mutation(() => Books)
    async createBook(@Args('data') data: CreateBookDTO) {
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

    @Query()
    async listBooks(@Args('search') search: string) {
        return this.bookService.list(search);
    }

    @Query(() => Books)
    async showBook(@Args('id') id: number) {
        return this.bookService.show(id);
    }

    @Mutation(() => Books)
    async updatePartialBook(@Args('data') data: UpdateBookDTO, @Args('id') id: number) {
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

    @Mutation(() => Books)
    @UseInterceptors(FileInterceptor('file'))
    uploadFileBook(@Args('id') id: number, @UploadedFile() file: Express.Multer.File) {
        const image = file;
        return this.bookService.updateImage(id, image)
    }

    @Mutation(() => Boolean)
    async deleteBook(@Args('id') id: number) {
        return {
            success: await this.bookService.delete(id),
        };
    }
}