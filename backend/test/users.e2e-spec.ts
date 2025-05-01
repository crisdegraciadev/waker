/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { UsersModule } from '../src/api/users/users.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let api: App;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    api = app.getHttpServer();
  });

  describe('POST', () => {
    const createrUserDto = {
      email: 'test@email.com',
      password: '123456789',
      confirmPassword: '123456789',
    };

    it('should get 201 OK and the created user', async () => {
      const expectedFields = ['id', 'email'];

      const { body, statusCode } = await request(api)
        .post('/users')
        .send(createrUserDto);

      expect(statusCode).toBe(201);

      expectedFields.forEach((field) => {
        expect(body).toHaveProperty(field);
      });

      expect(body.id).toBeDefined();
      expect(createrUserDto.email).toBe(body.email);
      expect(body).not.toHaveProperty('password');
    });
  });
});
