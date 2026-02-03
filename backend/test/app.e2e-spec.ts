import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Hotel API (e2e)', () => {
  let app: INestApplication<App>;
  let adminToken = '';
  let staffToken = '';
  let createdRoomId = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@paloalto.com', password: 'admin_password_123' });
    adminToken = adminLogin.body.accessToken;

    const staffLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'staff@paloalto.com', password: 'staff_password_123' });
    staffToken = staffLogin.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects rooms without auth', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/rooms')
      .expect(401);
  });

  it('allows admin to create room', async () => {
    const roomNumber = `E2E-${Date.now()}`;
    const response = await request(app.getHttpServer())
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        number: roomNumber,
        type: 'Simple',
        price: 80,
        status: 'AVAILABLE',
      })
      .expect(201);

    createdRoomId = response.body.id;
    expect(response.body.number).toBe(roomNumber);
  });

  it('prevents staff from creating room', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/rooms')
      .set('Authorization', `Bearer ${staffToken}`)
      .send({
        number: `E2E-${Date.now()}`,
        type: 'Simple',
        price: 80,
        status: 'AVAILABLE',
      })
      .expect(403);
  });

  it('check-in and check-out flow works', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/rooms/${createdRoomId}/check-in`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ guestName: 'E2E Guest' })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/v1/rooms/${createdRoomId}/check-out`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
