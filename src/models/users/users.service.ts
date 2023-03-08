import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { AuthService } from 'src/services/auth/auth.service';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async createUser(user: Prisma.UserCreateInput) {
    const { email } = user;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new HttpException(
        'This user already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);

    user.password = hashedPassword;

    return await this.prisma.user.create({ data: user });
  }

  async loginUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new HttpException(
        'User credentials invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new HttpException(
        'User credentials invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;

    const token = this.authService.generateJwtToken(user);

    return token;
  }

  async editUser(id: string, user: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data: user });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
