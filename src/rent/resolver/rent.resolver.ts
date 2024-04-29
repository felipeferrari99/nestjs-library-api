import { RentsService } from "../rent.service";
import { BookService } from "src/book/book.service";
import { Mutation, Resolver, Query, Args } from "@nestjs/graphql";
import { Rents } from "../entity/rent.entity";
import { Books } from "../../book/entity/book.entity";
import { CreateRentArgs } from "../args/create-rent.args";

@Resolver()
export class RentsResolver{
    constructor(
        private readonly rentService: RentsService,
        private readonly bookService: BookService
    ) {}

    @Mutation(() => Rents)
    async createRent(@Args() args: CreateRentArgs) {
        await this.rentService.create(args.data);
    }

    @Query(() => Rents)
    async listMyRents(@Args('userId') userId: number) {
        return this.rentService.listMyRents(userId);
    }

    @Query(() => Rents)
    async listAllRents() {
        return this.rentService.listAllRents();
    }

    @Query(() => Books)
    async listAvailable() {
        return this.bookService.listAvailable();
    }

    @Mutation(() => Rents)
    async returnBook(@Args('id') id: number) {
        return await this.rentService.returnBook(id);
    }    
}