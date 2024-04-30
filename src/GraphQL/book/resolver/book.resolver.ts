import { BadRequestException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BookService } from "../../../book/book.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateBookInput } from "../inputs/update-book.input";
import { AuthorService } from "../../../author/author.service";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { CreateBookArgs } from "../args/create-book.args";
import { BookType } from "../types/book.type";

@Resolver('books')
export class BookResolver {
    constructor(
        private readonly bookService: BookService,
        private readonly authorService: AuthorService
    ) {}

    @Mutation(() => BookType)
    async createBook(@Args() args: CreateBookArgs) {
        const authorData = await this.authorService.getByName(args.data.authorName)
        if (args.data.release_date == 'Invalid date') {
            throw new BadRequestException('Insert a valid date.');
        }
        if (!authorData) {
            const newAuthor = await this.authorService.create({'name': args.data.authorName, 'image': null, 'description': null})
            args.data.author_id = newAuthor.id;
        } 
        if (authorData) {
            args.data.author_id = authorData.id
        }
        return this.bookService.create(args.data);
    }

    @Query(() => [BookType])
    async listBooks(@Args('search') search: string) {
        return this.bookService.list(search);
    }

    @Query(() => BookType)
    async showBook(@Args('id') id: number) {
        return this.bookService.show(id);
    }

    @Mutation(() => BookType)
    async updatePartialBook(@Args('data') data: UpdateBookInput, @Args('id') id: number) {
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

    @Mutation(() => BookType)
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