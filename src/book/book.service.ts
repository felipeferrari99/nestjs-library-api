import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Books } from "./entity/book.entity";
import { Like, MoreThanOrEqual, Repository } from "typeorm";
import { CreateBookDTO } from "./dto/create-book.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { UpdateBookDTO } from "./dto/update-book.dto";

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Books)
        private booksRepository: Repository<Books>,
        private readonly cloudinaryService: CloudinaryService
    ) {}

    async create(data: CreateBookDTO) {
        const book = this.booksRepository.create(data);
        return this.booksRepository.save(book);
    }

    async list(search: string) {
        return this.booksRepository.find({
          where: {
            title: Like(`${search}%`)
          },
          relations: ["author"]
        });
    }

    async show(id: number) {
        await this.exists(id);
        return this.booksRepository.findOne({
            where: { id },
            relations: ["author", "comments.user"]
        });
    }

    async listAvailable() {
        return this.booksRepository.find({
          where: {
            qty_available: MoreThanOrEqual(1)  
          },
          relations: ["author"]
        });
    }

    async updatePartial(id: number, { title, release_date, qty_available, author_id, description }: UpdateBookDTO) {
        try {
            const data: any = {};

            if (title) {
                data.title = title;
            }

            if (release_date) {
                data.release_date = release_date;
            }
            
            if (qty_available || qty_available === 0) {
                data.qty_available = qty_available;
            }

            if (author_id) {
                data.author_id = author_id;
            }

            if (description) {
                data.description = description;
            }

            await this.booksRepository.update(id, data);
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
                if (fileId != process.env.CLOUDINARY_BOOK_ID) {
                    await this.cloudinaryService.deleteFile(fileId)
                }
                const newImage = await this.cloudinaryService.uploadFile(image);
                data.image = newImage.url;
            } else {
                if (fileId != process.env.CLOUDINARY_BOOK_ID) {
                    await this.cloudinaryService.deleteFile(fileId)
                }
                data.image = process.env.CLOUDINARY_BOOK_URL;
            }

            await this.booksRepository.update(id, data);
            return await this.show(id);
        } catch (err) {
            throw err
        }
    }

    async delete(id: number) {
        await this.exists(id);
        await this.deleteBookImage(id)
        await this.booksRepository.delete(id);
        return true;
    }
    
    async deleteBookImage(id: number) {
        const oldImage = await this.show(id);
        const regex = /\/([^\/]+)\.[^\/]+$/;
        const match = oldImage.image.match(regex);
        const fileId = match[1];
        if (fileId != process.env.CLOUDINARY_BOOK_ID) {
            await this.cloudinaryService.deleteFile(fileId)
        }
    }

    async exists(id: number) {
        if (
            !(await this.booksRepository.exists({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`The book with id ${id} does not exist`);
        }
    }
}