import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "../user/user.service";
import { BookService } from "../book/book.service";
import { AuthorService } from "../author/author.service";


@Controller()
export class ImageUploadController{
    constructor(
        private readonly userService: UserService,
        private readonly bookService: BookService,
        private readonly authorService: AuthorService
    ) {}

@Post('image')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@Body('id') id: number, @Body('origin') origin: string, @UploadedFile() file: Express.Multer.File) {
    const image = file;
    if (origin == 'user') {
        return this.userService.updateImage(id, image)
    }
    if (origin == 'book') {
        return this.bookService.updateImage(id, image)
    }
    if (origin == 'author') {
        return this.authorService.updateImage(id, image)
    }
}
}