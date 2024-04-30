import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Rents } from "./entity/rent.entity";
import { RentsService } from "./rent.service";
import { BookModule } from "src/book/book.module";
import { RentsResolver } from "../GraphQL/rent/resolver/rent.resolver";

@Module({
    imports: [
        TypeOrmModule.forFeature([Rents]),
        BookModule
    ],
    providers: [RentsService, RentsResolver],
    exports: [RentsService]
})
export class RentsModule{}