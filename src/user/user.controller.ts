import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserLoginDTO } from "./dto/user-login.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class UserController{
    constructor(
      private readonly userService: UserService
    ) {}

    @Post('register')
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    @Post('login')
    async login(@Body() { username, password }: UserLoginDTO) {
        return this.userService.login(username, password);
    }

    @Patch('user/:id')
    async updatePartial(@Body() data: UpdateUserDTO, @Param('id', ParseIntPipe) id: number) {
      return this.userService.updatePartial(id, data);
    }

    @Patch('books/:id/favorite')
    async updateFavorite(@Param('id', ParseIntPipe) id: number, @Body('user_id', ParseIntPipe) user_id: number) {
      const data = await this.userService.getOne(user_id);
      if (data.favorite_book == id){
        data.favorite_book = null
      } else {
        data.favorite_book = id
      }
      return this.userService.updateFavorite(user_id, data);
    }

    @Post('user/:id/image')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
        const image = file;
        return this.userService.updateImage(id, image)
    }

    @Get('user/:id')
    async show(@Param('id', ParseIntPipe) id: number) {
        return this.userService.show(id);
    }
}