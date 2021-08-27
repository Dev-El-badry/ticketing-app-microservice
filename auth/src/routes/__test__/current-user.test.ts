import request from 'supertest';
import {app} from '../../app';

it('responds with details with current user', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .set('Cookie', cookie)
    .expect(201);
  
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticate', async () => {
  const {body: response} = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(201);

  expect(response.currentUser).toBeNull();
});