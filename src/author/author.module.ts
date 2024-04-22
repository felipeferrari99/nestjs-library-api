import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Authors } from "./entity/author.entity";
import { AuthorController } from "./author.controller";
import { AuthorService } from "./author.service";
import { Books } from "src/book/entity/book.entity";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Authors]),
        TypeOrmModule.forFeature([Books]),
        CloudinaryModule
    ],
    controllers: [AuthorController],
    providers: [AuthorService],
    exports: [AuthorService]
})
export class AuthorModule {}