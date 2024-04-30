import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CommentService } from "../../../comment/comment.service";
import { CommentType } from "../types/comment.type";
import { CreateCommentArgs } from "../args/create-comment.args";


@Resolver('books/:id/comments')
export class CommentResolver {
    constructor(private readonly commentService: CommentService) {}

    @Mutation(() => CommentType)
    async createComment(@Args() args: CreateCommentArgs) {
        await this.commentService.create(args.data);
    }

    @Mutation(() => CommentType)
    async deleteComment(@Args('id') id: number, @Args('commentId') commentId: number) {
        return {
            success: await this.commentService.delete(id, commentId),
        };
  }
}