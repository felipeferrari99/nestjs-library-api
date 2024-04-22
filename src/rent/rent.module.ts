import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rents } from "./entity/rent.entity";
import { RentsService } from "./rent.service";
import { RentsController } from "./rent.controller";
import { BookModule } from "src/book/book.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Rents]),
        BookModule
    ],
    controllers: [RentsController],
    providers: [RentsService],
    exports: [RentsService]
})
export class RentsModule{}