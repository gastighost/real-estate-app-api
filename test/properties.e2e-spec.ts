import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { PrismaService } from '../src/services/prisma/prisma.service';
import { PropertiesModule } from '../src/models/properties/properties.module';
import { JwtStrategy } from '../src/services/auth/jwt.strategy';
import { UsersModule } from '../src/models/users/users.module';

describe('Properties', () => {
  jest.setTimeout(10000);

  let app: INestApplication;
  const prismaService = new PrismaService();
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UsersModule,
        PropertiesModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: { expiresIn: '24h' },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [JwtStrategy],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await prismaService.user.deleteMany({
      where: {
        OR: [{ username: 'bernie' }, { email: 'bernie@gmail.com' }],
      },
    });

    const mockedUserInput = {
      username: 'bernie',
      email: 'bernie@gmail.com',
      password: 'Password123456',
      phone: '+61770101111',
    };

    await request(app.getHttpServer())
      .post('/users/signup/')
      .send(mockedUserInput);

    const response = await request(app.getHttpServer())
      .post('/users/login/')
      .send({
        username: mockedUserInput.username,
        password: mockedUserInput.password,
      });

    token = response.body.token;
  });

  it(`/GET /properties/`, async () => {
    const response = await request(app.getHttpServer())
      .get('/properties/')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: {
        OR: [{ username: 'bernie' }, { email: 'bernie@gmail.com' }],
      },
    });

    await app.close();
  });
});
