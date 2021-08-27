import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successfully sign up', async() => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with a invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest',
      password: 'password'
    })
    .expect(400);
});
it('returns a 400 with a invalid password', async () => {
  return request(app)
  .post('/api/users/signup')
  .send({
    email: 'test2@test.com',
    password: 'pa'
  })
  .expect(400);
});
it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'pas'
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com'
    })
    .expect(400);
});
it('disallowed duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test1@test.com',
      password: 'password'
    })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test1@test.com',
      password: 'password'
    })
    .expect(400);
});
it('sets a cookie after successfully signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test4@test.com',
      password: 'password'
    })
    .expect(201);
  
  expect(response.get('Set-Cookie')).toBeDefined();
});
