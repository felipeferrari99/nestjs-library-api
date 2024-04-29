import { Injectable, NotFoundException } from "@nestjs/common";
import { Authors } from "./types/author.entity";
import { Like, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAuthorDTO } from "./inputs/create-author.dto";
import { UpdateAuthorDTO } from "./inputs/update-author.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(Authors)
        private authorsRepository: Repository<Authors>,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    async create(data: CreateAuthorDTO) {
        if (!data.image) {
            data.image = process.env.CLOUDINARY_PROFILE_URL;
        }
        const author = this.authorsRepository.create(data)
        return this.authorsRepository.save(author)
    }

    async list(search: string) {
        return this.authorsRepository.find({
          where: {
            name: Like(`${search}%`)
          }
        });
      }

    async show(id: number) {
        await this.exists(id);
        return this.authorsRepository.findOne({
            where: { id: id },
            relations: ["books"]
        })
    }

    async existsByName(name: string) {
        if (
            !(await this.authorsRepository.exists({
                where: {
                    name: name,
                },
            }))
        ) {
            return false;
        }
    }

    async getByName(name: string) {
        await this.existsByName(name);
        return this.authorsRepository.findOne({
            where: { name }
        })
    }

    async updatePartial(id: number, { name, description }: UpdateAuthorDTO) {
        try {
            const data: any = {};

            if (name) {
                data.name = name;
            }

            if (description) {
                data.description = description;
            }

            await this.authorsRepository.update(id, data);
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

            await this.authorsRepository.update(id, data);
            return await this.show(id);
        } catch (err) {
            throw err
        }
    }

    async delete(id: number) {
        await this.exists(id);
        await this.deleteAuthorImage(id);
        await this.authorsRepository.delete(id);
        return true;
    }    

    async deleteAuthorImage(id: number) {
        const oldImage = await this.show(id);
        const regex = /\/([^\/]+)\.[^\/]+$/;
        const match = oldImage.image.match(regex);
        const fileId = match[1];
        if (fileId != process.env.CLOUDINARY_PROFILE_ID) {
            await this.cloudinaryService.deleteFile(fileId)
        }
    }    

    async exists(id: number) {
        if (
            !(await this.authorsRepository.exists({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`The author with id ${id} does not exist`);
        }
    }
}