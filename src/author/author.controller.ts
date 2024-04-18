import { Body, Controller, Get, Param, ParseIntPipe, Post, Res } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { CreateAuthorDTO } from "./dto/create-author.dto";

@Controller('authors')
export class AuthorController {
    constructor(private readonly authorService: AuthorService) { }

    @Post()
    async create(@Body() data: CreateAuthorDTO) {
        return this.authorService.create(data);
    }

    @Get()
    async list() {
        return this.authorService.list();
    }

    @Get(':id')
    async show(@Param('id', ParseIntPipe) id: number) {
        return this.authorService.show(id);
    }
}