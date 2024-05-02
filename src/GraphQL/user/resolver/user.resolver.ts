import { UserService } from "../../../user/user.service";
import { UserLoginInput } from "../inputs/user-login.input";
import { UpdateUserInput } from "../inputs/update-user.input";
import { Args, Mutation, Resolver, Query} from "@nestjs/graphql";
import { CreateUserArgs } from "../args/create-user.args";
import { CreateUserResponse, UserType } from "../type/user.type";

@Resolver()
export class UserResolver {
    constructor(
      private readonly userService: UserService
    ) {}

    @Mutation(() => CreateUserResponse)
    async createUser(@Args() args: CreateUserArgs): Promise<CreateUserResponse> {
        const { user, token } = await this.userService.create(args.data);
        return { user, token };
    }

    @Mutation(() => CreateUserResponse)
    async login(@Args('data') data: UserLoginInput): Promise<CreateUserResponse> {
        return this.userService.login(data.username, data.password);
    }

    @Mutation(() => UserType)
    async updatePartialUser(@Args('data') data: UpdateUserInput, @Args('id') id: number) {
      return this.userService.updatePartial(id, data);
    }

    @Mutation(() => UserType)
    async updateFavorite(@Args('id') id: number, @Args('user_id') user_id: number) {
      const data = await this.userService.getOne(user_id);
      if (data.favorite_book == id){
        data.favorite_book = null
      } else {
        data.favorite_book = id
      }
      return this.userService.updateFavorite(user_id, data);
    }

    @Query(() => UserType)
    async showUser(@Args('id') id: number) {
        return this.userService.show(id);
    }
}