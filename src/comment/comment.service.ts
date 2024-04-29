import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDTO } from "./inputs/create-comment.dto";
import { Comments } from "./entity/comment.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CommentService{
    constructor(
        @InjectRepository(Comments)
        private commentsRepository: Repository<Comments>
    ) {}

    async create(data: CreateCommentDTO) {
        const comment = this.commentsRepository.create(data)
        return this.commentsRepository.save(comment)
    }

    async delete(id: number, commentId: number) {
        await this.exists(commentId);
        await this.commentsRepository.delete(commentId);
        return true;
      }

    async exists(id: number) {
        if (
            !(await this.commentsRepository.exists({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`The comment with id ${id} does not exist`);
        }
    }
}