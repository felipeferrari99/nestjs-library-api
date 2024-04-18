import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Books } from "./entity/book.entity";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Books])
    ],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService]
})
export class BookModule {}