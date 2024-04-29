import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Books } from "./types/book.entity";
import { BookResolver } from "./resolver/book.resolver";
import { BookService } from "./book.service";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { AuthorModule } from "../author/author.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Books]),
        CloudinaryModule,
        AuthorModule
    ],
    providers: [BookService, BookResolver],
    exports: [BookService]
})
export class BookModule {}