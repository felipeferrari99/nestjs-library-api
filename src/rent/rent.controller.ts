import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { RentsService } from "./rent.service";
import { CreateRentDTO } from "./dto/create-rent.dto";
import { BookService } from "src/book/book.service";

@Controller()
export class RentsController{
    constructor(
        private readonly rentService: RentsService,
        private readonly bookService: BookService
    ) {}

    @Post(':id/rent')
    async create(@Body() data: CreateRentDTO) {
        await this.rentService.create(data);
    }

    @Get('myRents/:userId')
    async listMyRents(@Param('userId', ParseIntPipe) userId: number) {
        return this.rentService.listMyRents(userId);
    }

    @Get('allRents')
    async listAllRents() {
        return this.rentService.listAllRents();
    }

    @Get('available')
    async listAvailable() {
        return this.bookService.listAvailable();
    }

    @Post('return/:id')
    async returnBook(@Param('id', ParseIntPipe) id: number) {
        return await this.rentService.returnBook(id);
    }    
}