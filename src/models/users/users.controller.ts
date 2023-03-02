import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const { username, password, email, phone } = body;

    const user = await this.usersService.createUser({
      username,
      password,
      email,
      phone,
    });

    return { message: 'User successfully created!', user };
  }

  @Post('login')
  async signin(@Body() body: LoginUserDto) {
    const { username, password } = body;

    const token = await this.usersService.loginUser(username, password);

    return { message: 'User successfully logged in!', token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const { user } = req;

    return { user };
  }
}
