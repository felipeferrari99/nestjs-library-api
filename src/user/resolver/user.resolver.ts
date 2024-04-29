import { UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "../user.service";
import { UserLoginInput } from "../inputs/user-login.input";
import { UpdateUserInput } from "../inputs/update-user.input";
import { FileInterceptor } from "@nestjs/platform-express";
import { Args, Mutation, Resolver, Query} from "@nestjs/graphql";
import { Users } from "../entity/user.entity";
import { CreateUserArgs } from "../args/create-user.args";

@Resolver()
export class UserResolver {
    constructor(
      private readonly userService: UserService
    ) {}

    @Mutation(() => Users)
    async createUser(@Args() args: CreateUserArgs) {
        return this.userService.create(args.data);
    }

    @Mutation(() => Users)
    async login(@Args('data') data: UserLoginInput) {
        return this.userService.login(data.username, data.password);
    }

    @Mutation(() => Users)
    async updatePartialUser(@Args('data') data: UpdateUserInput, @Args('id') id: number) {
      return this.userService.updatePartial(id, data);
    }

    @Mutation(() => Users)
    async updateFavorite(@Args('id') id: number, @Args('user_id') user_id: number) {
      const data = await this.userService.getOne(user_id);
      if (data.favorite_book == id){
        data.favorite_book = null
      } else {
        data.favorite_book = id
      }
      return this.userService.updateFavorite(user_id, data);
    }

    @Mutation(() => Users)
    @UseInterceptors(FileInterceptor('file'))
    uploadFileUser(@Args('id') id: number, @UploadedFile() file: Express.Multer.File) {
        const image = file;
        return this.userService.updateImage(id, image)
    }

    @Query(() => Users)
    async showUser(@Args('id') id: number) {
        return this.userService.show(id);
    }
}