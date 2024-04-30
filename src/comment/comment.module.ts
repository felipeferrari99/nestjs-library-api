import { Module } from "@nestjs/common";
import { Comments } from "./entity/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentService } from "./comment.service";
import { CommentResolver } from "../GraphQL/comment/resolver/comment.resolver";
@Module({
    imports: [
        TypeOrmModule.forFeature([Comments])
    ],
    providers: [CommentService, CommentResolver],
    exports: [CommentService]
})
export class CommentModule {}