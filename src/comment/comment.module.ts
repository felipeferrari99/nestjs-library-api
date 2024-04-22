import { Module } from "@nestjs/common";
import { Comments } from "./entity/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comments])
    ],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentModule {}