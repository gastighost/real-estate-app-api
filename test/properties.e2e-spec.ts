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
  let id: string;

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
    expect(response.body.properties.length).toBeGreaterThan(0);
  });

  it(`/POST /property/`, async () => {
    const newProperty = {
      name: 'Haunted mansion',
      houseNumber: 555,
      street: 'Dark Way',
      suburb: "Hell's Village",
      zipcode: 5060,
      sellStatus: 'SALE',
      price: 20000000,
      currency: 'USD',
      rooms: 10,
      bathrooms: 10,
      parking: true,
      floors: 3,
      sqm: 2000,
      type: 'HOUSE',
    };

    const response = await request(app.getHttpServer())
      .post('/properties/')
      .set('Authorization', `Bearer ${token}`)
      .send(newProperty);

    id = response.body.property.id;

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Property successfully created!');
    expect(response.body.property).toMatchObject(newProperty);
  });

  it(`/GET /property/{id}`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/properties/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.property).toMatchObject({
      name: 'Haunted mansion',
      houseNumber: 555,
      street: 'Dark Way',
      suburb: "Hell's Village",
      zipcode: 5060,
      sellStatus: 'SALE',
      price: 20000000,
      currency: 'USD',
      rooms: 10,
      bathrooms: 10,
      parking: true,
      floors: 3,
      sqm: 2000,
      type: 'HOUSE',
    });
  });

  it(`/PATCH /property/{id}`, async () => {
    const updatedProperty = {
      name: 'Holy mansion',
      houseNumber: 20,
      street: 'Light Way',
      suburb: "Heaven's Village",
      zipcode: 3040,
      sellStatus: 'SALE',
      price: 500000000,
      currency: 'USD',
      rooms: 20,
      bathrooms: 20,
      parking: true,
      floors: 2,
      sqm: 3000,
      type: 'HOUSE',
    };

    const response = await request(app.getHttpServer())
      .patch(`/properties/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProperty);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Property successfully updated!');
    expect(response.body.property).toMatchObject(updatedProperty);
  });

  it(`/DELETE /property/id}`, async () => {
    const response = await request(app.getHttpServer())
      .delete(`/properties/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Property successfully deleted!');
    expect(response.body.property).toMatchObject({
      name: 'Holy mansion',
      houseNumber: 20,
      street: 'Light Way',
      suburb: "Heaven's Village",
      zipcode: 3040,
      sellStatus: 'SALE',
      price: 500000000,
      currency: 'USD',
      rooms: 20,
      bathrooms: 20,
      parking: true,
      floors: 2,
      sqm: 3000,
      type: 'HOUSE',
    });
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
