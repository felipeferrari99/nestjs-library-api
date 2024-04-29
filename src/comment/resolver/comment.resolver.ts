import { CommentService } from "../comment.service";
import { CreateCommentDTO } from "../inputs/create-comment.dto";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Comments } from "../entity/comment.entity";

@Resolver('books/:id/comments')
export class CommentResolver {
    constructor(private readonly commentService: CommentService) {}

    @Mutation(() => Comments)
    async createComment(@Args('data') data: CreateCommentDTO) {
        await this.commentService.create(data);
    }

    @Mutation(() => Comments)
    async deleteComment(@Args('id') id: number, @Args('commentId') commentId: number) {
        return {
            success: await this.commentService.delete(id, commentId),
        };
  }
}