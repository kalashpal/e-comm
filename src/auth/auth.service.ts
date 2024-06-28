import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Replace with your user service
import { RegisterDto } from '../dto/register.dto'; // Import your RegisterDto
import { CreateUserDto } from '../dto/create-user.dto'; // Import your CreateUserDto

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: RegisterDto) {
    const { username, password, email, role } = userDto;

    // Check if user already exists
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    // Create the user in the database
    const createUserDto: CreateUserDto = { username, password, email, role };
    const createdUser = await this.userService.create(createUserDto);

    // Generate JWT token
    const payload = { username: createdUser.username, sub: createdUser.id };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (user && user.password === password) {
      const { password, ...result } = user;

      // Generate JWT token
      const payload = { username: user.username, sub: user.id, roles: user.role };
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    }

    return null;
  }

  // Method to match roles
  async matchRoles(requiredRoles: string[], userRoles: string[]): Promise<boolean> {
    return requiredRoles.every(role => userRoles.includes(role));
  }
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result; // Return the user object without the password
    }
    return null;
  }

  // Method to validate user by ID for JWT strategy
  async validateUserById(userId: number) {
    return this.userService.findOneById(userId);
  }
}

