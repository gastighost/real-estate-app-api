import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { UsersModule } from '../src/models/users/users.module';
import { UsersService } from '../src/models/users/users.service';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/services/prisma/prisma.service';
import { AuthService } from '../src/services/auth/auth.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('Users', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();
  const jwtService = new JwtService();
  const authService = new AuthService(jwtService);
  const usersService = new UsersService(prismaService, authService);

  beforeAll(async () => {
    await prismaService.user.deleteMany({
      where: { OR: [{ username: 'hemady' }, { email: 'hemady@gmail.com' }] },
    });

    const moduleRef = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '24h' },
          }),
          inject: [ConfigService],
        }),
      ],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST /users/signup/`, async () => {
    const mockedUserInput = {
      username: 'hemady',
      email: 'hemady@gmail.com',
      password: 'Password123456',
      phone: '+61770101111',
    };

    const response = await request(app.getHttpServer())
      .post('/users/signup/')
      .send(mockedUserInput);

    expect(response.body.user.password).not.toBe(mockedUserInput.password);

    delete mockedUserInput.password;

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject(mockedUserInput);
  });

  afterAll(async () => {
    await app.close();
  });
});
