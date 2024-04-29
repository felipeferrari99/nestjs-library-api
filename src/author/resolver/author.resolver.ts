import { UploadedFile, UseInterceptors } from "@nestjs/common";
import { AuthorService } from "../author.service";
import { UpdateAuthorInput } from "../inputs/update-author.input";
import { FileInterceptor } from "@nestjs/platform-express";
import { Mutation, Resolver, Query, Args } from "@nestjs/graphql";
import { Authors } from "../entity/author.entity";
import { CreateAuthorArgs } from "../args/create-author.args";

@Resolver('authors')
export class AuthorResolver {
    constructor(private readonly authorService: AuthorService) { }

    @Mutation(() => Authors)
    async createAuthor(@Args() args: CreateAuthorArgs) {
        return this.authorService.create(args.data);
    }

    @Query(() => Authors)
    async listAuthors(@Args('search') search: string) {
        return this.authorService.list(search);
    }

    @Query(() => Authors)
    async showAuthor(@Args('id') id: number) {
        return this.authorService.show(id);
    }

    @Mutation(() => Authors)
    async updatePartialAuthor(@Args('data') data: UpdateAuthorInput, @Args('id') id: number) {
        return this.authorService.updatePartial(id, data);
    }

    @Mutation(() => Authors)
    @UseInterceptors(FileInterceptor('file'))
    uploadFileAuthor(@Args('id') id: number, @UploadedFile() file: Express.Multer.File) {
        const image = file;
        return this.authorService.updateImage(id, image)
    }

    @Mutation(() => Boolean)
    async deleteAuthor(@Args('id') id: number) {
        return {
            success: await this.authorService.delete(id),
        };
    }
}