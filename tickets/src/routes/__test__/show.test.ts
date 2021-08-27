import {app} from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';

//returns 404 is the ticket is not found
it('returns 404 if the ticket is not found', async() => {
  const fakeTicketId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${fakeTicketId}`).set('Cookie', global.signin()).send().expect(404);
});

//returns the ticket if the ticket is found
it('returns the ticket if the ticket is found', async()=> {
  const createTicket = {title: "fake ticket", price: 20};
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send(createTicket).expect(201);

  await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(201);
});