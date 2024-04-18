import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Users } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from "./dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ) {}

    async create(data: CreateUserDTO) {
        if (
            await this.usersRepository.exists({
                where: {
                    username: data.username
                },
            })
        ) {
            throw new BadRequestException('User already exists');
        }

        if (
            await this.usersRepository.exists({
                where: {
                    email: data.email
                },
            })
        ) {
            throw new BadRequestException('There is already an account using this e-mail address.');
        }

        const salt = await bcrypt.genSalt(); true

        data.password = await bcrypt.hash(data.password, salt)

        const user = this.usersRepository.create(data)

        return this.usersRepository.save(user)
    }

    async show(id: number) {
        await this.exists(id);
        return this.usersRepository.findOne({
            where: { id },
            relations: ["books"]
        });
    }

    async exists(id: number) {
        if (
            !(await this.usersRepository.exists({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`The user with id ${id} does not exist`);
        }
    }
}