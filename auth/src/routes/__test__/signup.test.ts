import request from 'supertest';
import { app } from '../../app';

describe('GET /api/users/currentuser', () => {
  it('should response with a message', async () => {
    const response = await request(app)
      .get('/api/users/currentuser')
      .expect('Content-Type', /json/)
      .expect(201);
  });
});

describe('POST /api/users/signup', () => {
  it('should response with a successfully message', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect('Content-Type', /json/)
      .expect(201);
  });
});
