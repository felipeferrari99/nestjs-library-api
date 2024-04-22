import { Body, Controller, Delete, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDTO } from "./dto/create-comment.dto";

@Controller('books/:id/comments')
export class CommentController{
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async create(@Body() data: CreateCommentDTO) {
        await this.commentService.create(data);
    }

    @Delete(':commentId')
    async delete(@Param('id') id: number, @Param('commentId') commentId: number) {
        return {
            success: await this.commentService.delete(id, commentId),
        };
  }
}