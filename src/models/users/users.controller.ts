import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
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

  @HttpCode(200)
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

  @UseGuards(JwtAuthGuard)
  @Patch()
  async editUser(@Req() req, @Body() body: EditUserDto) {
    const { id } = req.user;
    const { username, password, email, phone } = body;

    const user = await this.usersService.editUser(id, {
      username,
      password,
      email,
      phone,
    });

    return { message: 'User successfully updated!', user };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Req() req) {
    const { id } = req.user;

    const user = await this.usersService.deleteUser(id);

    return { message: 'User successfully deleted!', user };
  }
}
