import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Users } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private readonly jwtService: JwtService,
        private readonly cloudinaryService: CloudinaryService 
    ) {}

    createToken(user: Users) {
        return {
          token: this.jwtService.sign(
            {
              id: user.id,
              username: user.username,
              type: user.type,
              image: user.image,
              favorite_book: user.favorite_book
            },
            {
              expiresIn: '1 days',
              subject: String(user.id),
              secret: String(process.env.JWT_SECRET)
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

    async getOne(id: number) {
        await this.exists(id);
        return this.usersRepository.findOne({
            where: { id }
        });
    }

    async updatePartial(id: number, { email, password, description }: UpdateUserDTO) {
        try {
            const data: any = {};

            if (email) {
                data.email = email;
            }

            if (password) {
                const salt = await bcrypt.genSalt();
                data.password = await bcrypt.hash(password, salt);
            }

            if (description) {
                data.description = description;
            }

            await this.usersRepository.update(id, data);
            return await this.show(id)
        } catch (err) {
            throw err
        }
    }

    async updateImage(id: number, image) {
        try {
            const oldImage = await this.show(id);

            const data: any = {};
            const regex = /\/([^\/]+)\.[^\/]+$/;
            const match = oldImage.image.match(regex);
            const fileId = match[1];

            if (image) {
                if (fileId != process.env.CLOUDINARY_PROFILE_ID) {
                    await this.cloudinaryService.deleteFile(fileId)
                }
                const newImage = await this.cloudinaryService.uploadFile(image);
                data.image = newImage.url;
            } else {
                if (fileId != process.env.CLOUDINARY_PROFILE_ID) {
                    await this.cloudinaryService.deleteFile(fileId)
                }
                data.image = process.env.CLOUDINARY_PROFILE_URL;
            }

            await this.usersRepository.update(id, data);
            const user = await this.show(id);
            return this.createToken(user);
        } catch (err) {
            throw err
        }
    }

    async updateFavorite(user_id: number, user: Users) {
        const id = user_id
        await this.usersRepository.update(id, user);
        return await this.show(id)
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