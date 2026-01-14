import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserObject } from './object/user.object';
import {
  UserArgs,
  UserCreateArgs,
  UserDeleteArgs,
  UsersArgs,
  UserUpdateArgs,
} from './dto/user.args';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserObject, { nullable: true })
  async user(@Args() args: UserArgs): Promise<UserObject | null> {
    return this.userService.findUnique(args);
  }

  @Query(() => [UserObject])
  async users(@Args() args?: UsersArgs): Promise<UserObject[]> {
    return this.userService.findMany(args);
  }

  @Mutation(() => UserObject)
  async createUser(@Args() args: UserCreateArgs): Promise<UserObject> {
    const { budgetId, ...restArgs } = args.data;

    return this.userService.create({
      data: {
        ...restArgs,
        budget: { connect: { id: budgetId } },
      },
    });
  }

  @Mutation(() => UserObject)
  async updateUser(@Args() args: UserUpdateArgs): Promise<UserObject> {
    return this.userService.update(args);
  }

  @Mutation(() => UserObject)
  async deleteUser(@Args() args: UserDeleteArgs): Promise<UserObject> {
    return this.userService.delete(args);
  }
}
