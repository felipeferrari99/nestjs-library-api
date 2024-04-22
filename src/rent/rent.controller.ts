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
    async show(@Param('userId', ParseIntPipe) userId: number) {
        return this.rentService.show(userId);
    }

    @Get('allRents')
    async list() {
        return this.rentService.list();
    }

    @Get('available')
    async listAvailable() {
        return this.bookService.listAvailable();
    }

    @Post('return/:id')
    async returnBook(@Param('id', ParseIntPipe) id: number) {
        const rent = await this.rentService.returnBook(id);
        rent.status = 'returned'
        rent.date_returned = (new Date()).toISOString().split('T')[0]
        return await this.rentService.saveReturn(id, rent);
    }
}