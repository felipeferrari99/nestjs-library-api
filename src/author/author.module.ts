import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Authors } from "./types/author.entity";
import { AuthorService } from "./author.service";
import { Books } from "src/book/types/book.entity";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { AuthorResolver } from "./resolver/author.resolver";

@Module({
    imports: [
        TypeOrmModule.forFeature([Authors]),
        TypeOrmModule.forFeature([Books]),
        CloudinaryModule
    ],
    providers: [AuthorService, AuthorResolver],
    exports: [AuthorService]
})
export class AuthorModule {}