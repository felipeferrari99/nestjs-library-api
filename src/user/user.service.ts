import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Users } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private readonly jwtService: JwtService,
    ) {}

    createToken(user: Users) {
        return {
          token: this.jwtService.sign(
            {
              id: user.id,
              username: user.username,
              type: user.type,
              image: user.image
            },
            {
              expiresIn: '1 days',
              subject: String(user.id),
            },
          ),
        };
    }
    
    async login(username: string, password: string) {
        const user = await this.usersRepository.findOneBy({
            username,
        });
    
        if (!user) {
          throw new UnauthorizedException('Invalid username or password.');
        }
    
        if (!(await bcrypt.compare(password, user.password))) {
          throw new UnauthorizedException('Invalid username or password.');
        }
    
        return this.createToken(user);
    }

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

        const newUser = await this.usersRepository.save(user)

        return this.createToken(newUser);
    }

    async show(id: number) {
        await this.exists(id);
        return this.usersRepository.findOne({
            where: { id },
            relations: ["book"]
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