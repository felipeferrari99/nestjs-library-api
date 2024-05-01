import { RentsService } from "../../../rent/rent.service";
import { BookService } from "src/book/book.service";
import { Mutation, Resolver, Query, Args } from "@nestjs/graphql";
import { CreateRentArgs } from "../args/create-rent.args";
import { RentType } from "../types/rent.type";
import { BookType } from "../../book/types/book.type";

@Resolver()
export class RentsResolver{
    constructor(
        private readonly rentService: RentsService,
        private readonly bookService: BookService
    ) {}

    @Mutation(() => RentType)
    async createRent(@Args() args: CreateRentArgs) {
        await this.rentService.create(args.data);
    }

    @Query(() => [RentType])
    async listMyRents(@Args('userId') userId: number) {
        return this.rentService.listMyRents(userId);
    }

    @Query(() => [RentType])
    async listAllRents() {
        return this.rentService.listAllRents();
    }

    @Query(() => [BookType])
    async listAvailable() {
        return this.bookService.listAvailable();
    }

    @Mutation(() => RentType)
    async returnBook(@Args('id') id: number) {
        return await this.rentService.returnBook(id);
    }    
}