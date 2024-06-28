import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto'; // Define your RegisterDto
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard'; // Define your GqlAuthGuard
import { Roles } from './decorators/roles.decorator'; // Optional: if using @Roles() decorator

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation('register')
  async register(@Args('input') input: RegisterDto) {
  
    return this.authService.register(input);
  }

  @Mutation('login')
  async login(@Args('username') username: string, @Args('password') password: string) {
   
    return this.authService.login(username, password);
  }

  @Query('profile')
  @UseGuards(GqlAuthGuard)
  @Roles('admin') 
  async profile(@Context() context) {
    
    return context.req.user;
  }
}
