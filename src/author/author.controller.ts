import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { CreateAuthorDTO } from "./dto/create-author.dto";
import { UpdateAuthorDTO } from "./dto/update-author.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('authors')
export class AuthorController {
    constructor(private readonly authorService: AuthorService) { }

    @Post()
    async create(@Body() data: CreateAuthorDTO) {
        return this.authorService.create(data);
    }

    @Get()
    async list(@Query('search') search: string) {
        return this.authorService.list(search);
    }

    @Get(':id')
    async show(@Param('id', ParseIntPipe) id: number) {
        return this.authorService.show(id);
    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdateAuthorDTO, @Param('id', ParseIntPipe) id: number) {
        return this.authorService.updatePartial(id, data);
    }

    @Post(':id/image')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        const image = file;
        return this.authorService.updateImage(id, image)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return {
            success: await this.authorService.delete(id),
        };
    }
}