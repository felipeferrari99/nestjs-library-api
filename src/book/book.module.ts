import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Books } from "./entity/book.entity";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { AuthorModule } from "../author/author.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Books]),
        CloudinaryModule,
        AuthorModule
    ],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService]
})
export class BookModule {}