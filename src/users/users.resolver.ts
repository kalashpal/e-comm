import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('input') createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Query(() => [User])
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  async user(@Args('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(@Args('id') id: number, @Args('input') updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: number) {
    await this.usersService.remove(id);
    return true;
  }
}
