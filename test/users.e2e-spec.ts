import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaService } from '../src/services/prisma/prisma.service';
import { UsersModule } from '../src/models/users/users.module';

describe('Users', () => {
  let app: INestApplication;
  const prismaService = new PrismaService();

  beforeAll(async () => {
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
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await prismaService.user.deleteMany({
      where: {
        OR: [
          { username: 'hemady' },
          { username: 'hemadie' },
          { email: 'hemady@gmail.com' },
          { email: 'hemadie@gmail.com' },
        ],
      },
    });
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

  it(`/POST /users/signup/ (USER ALREADY EXISTS)`, async () => {
    const mockedUserInput = {
      username: 'hemady',
      email: 'hemady@gmail.com',
      password: 'Password123456',
      phone: '+61770101111',
    };

    const response = await request(app.getHttpServer())
      .post('/users/signup/')
      .send(mockedUserInput);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('This user already exists');
  });

  it(`/POST /users/login/`, async () => {
    const mockedUserInput = {
      username: 'hemady',
      password: 'Password123456',
    };

    const response = await request(app.getHttpServer())
      .post('/users/login/')
      .send(mockedUserInput);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User successfully logged in!');
    expect(response.body.token).toBeDefined();
  });

  it(`/POST /users/login/ (UNAUTHORIZED)`, async () => {
    const mockedUserInput = {
      username: 'hemady',
      password: 'Password12345',
    };

    const response = await request(app.getHttpServer())
      .post('/users/login/')
      .send(mockedUserInput);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('User credentials invalid');
  });

  it(`/PATCH /users/`, async () => {
    const mockedUserInput = {
      username: 'hemady',
      password: 'Password123456',
    };

    const response1 = await request(app.getHttpServer())
      .post('/users/login/')
      .send(mockedUserInput);

    const newMockedUserInput = {
      username: 'hemadie',
      email: 'hemadie@gmail.com',
      phone: '+61770102222',
    };

    const response2 = await request(app.getHttpServer())
      .patch('/users/')
      .set('Authorization', `Bearer ${response1.body.token}`)
      .send(newMockedUserInput);

    expect(response2.status).toBe(200);
    expect(response2.body.message).toBe('User successfully updated!');
    expect(response2.body.user).toMatchObject(newMockedUserInput);
  });

  it(`/DELETE /users/`, async () => {
    const mockedUserInput = {
      username: 'hemadie',
      password: 'Password123456',
    };

    const response1 = await request(app.getHttpServer())
      .post('/users/login/')
      .send(mockedUserInput);

    const response2 = await request(app.getHttpServer())
      .delete('/users/')
      .set('Authorization', `Bearer ${response1.body.token}`);

    delete mockedUserInput.password;
    delete response2.body.user.password;

    expect(response2.status).toBe(200);
    expect(response2.body.message).toBe('User successfully deleted!');
    expect(response2.body.user).toMatchObject(mockedUserInput);
  });

  it(`/DELETE /users/ (UNAUTHORIZED)`, async () => {
    const mockedUserInput = {
      username: 'hemady',
      password: 'Password123456',
    };

    const response1 = await request(app.getHttpServer())
      .post('/users/login/')
      .send(mockedUserInput);

    const response2 = await request(app.getHttpServer())
      .delete('/users/')
      .set('Authorization', `Bearer ${response1.body.token}`);

    expect(response2.status).toBe(401);
    expect(response2.body.message).toBe('Unauthorized');
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: {
        OR: [
          { username: 'hemady' },
          { username: 'hemadie' },
          { email: 'hemady@gmail.com' },
          { email: 'hemadie@gmail.com' },
        ],
      },
    });

    await app.close();
  });
});
