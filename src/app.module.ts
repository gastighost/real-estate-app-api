import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './services/prisma/prisma.module';
import { UsersModule } from './models/users/users.module';
import { AuthModule } from './services/auth/auth.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
