//echo \"Error: no test specified\" && exit 1

import request from 'supertest';
import App from '../src/app';
import prisma from '../src/prisma';

const app = new App().app;
describe('Test auth user', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  it('return success login', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'alfred@mail.com',
      password: 'Admin1234',
    });
    expect(response.body).toHaveProperty('success', true);
  });
  it('return success login', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'mulyono@mail.com',
      password: 'Admin12345.',
      confirmPassword: 'Admin12345.',
    });
    expect(response.body).toHaveProperty('success', true);
  });
});
