import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserLoginDTO } from "./dto/user-login.dto";

@Controller()
export class UserController{
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    @Post('login')
    async login(@Body() { username, password }: UserLoginDTO) {
        return this.userService.login(username, password);
    }

    @Get('user/:id')
    async show(@Param('id', ParseIntPipe) id: number) {
        return this.userService.show(id);
    }
}