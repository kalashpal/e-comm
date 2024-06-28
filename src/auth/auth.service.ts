import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './path-to-your-user.service'; // Replace with your user service
import { RegisterDto } from '../dto/register.dto'; // Import your RegisterDto

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: RegisterDto) {
    const { username, password, email, roles } = userDto;

    // Check if user already exists
    const existingUser = await this.userService.findByUsername(username);
    if (existingUser) {
      throw new Error('Username is already taken');
    }

    // Create the user in the database
    const createdUser = await this.userService.createUser({
      username,
      password,
      email,
      roles, // Optionally assign roles during registration
    });

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
      const payload = { username: user.username, sub: user.id ,roles:user.role};
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    }

    return null;
  }
}
