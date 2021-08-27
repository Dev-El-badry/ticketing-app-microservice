import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import {Ticket} from '../../models/Ticket';

//returns 404 if the provided id does not exists
it('returns 404 if the provided id does not exists', async() => {
  const fakeTicketID = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put(`/api/tickets/${fakeTicketID}`)
    .send({})
    .set('Cookie', global.signin());
  
  expect(response.status).not.toEqual(404);
});

//returns 401 if user not authenticate
it('returns 401 if user not authenticate', async() => {
  const fakeTicketID = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${fakeTicketID}`)
    .send({})
    .expect(401);
});

//returns a 401 if user does not own the ticket
it('returns a 401 if user does not own the ticket', async() => {
  const ticketInfo = {title: "ticket test", price: 20};
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send(ticketInfo).expect(201);

  const data = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send(ticketInfo)
    .expect(401);
});

//returns 400 if user the provided an invalid title or price
it('returns 400 if user the provided an invalid title or price', async() => {
  const ticketInfo = {title: "ticket test", price: 20};
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send(ticketInfo).expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: '',
      price: 20
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: 'fake ticket',
      price: -20
    })
    .expect(400);

});

//update the ticket provided valid inputs
it('update the ticket provided valid inputs', async() => {
  const cookie = global.signin();
  const createTicket = {title: "fake ticket", price: 20};
  const response = await request(app).post(`/api/tickets`).set('Cookie', cookie).send(createTicket).expect(201);
  
  const updateTicket = {title: "update ticket", price: 100};
  await request(app).put(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send(updateTicket).expect(201);
  
  const ticket = await request(app).get(`/api/tickets/${response.body.id}`).set('Cookie', cookie).send().expect(201);
  
  expect(ticket.body.title).toEqual(updateTicket.title);
  expect(ticket.body.price).toEqual(updateTicket.price);
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  const ticketInfo = {title: "ticket test", price: 20};

  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send(ticketInfo).expect(201);
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({orderId: new mongoose.Types.ObjectId().toHexString()});
  await ticket!.save();

  const updateTicket = {title: "update ticket", price: 100};
  await request(app).put(`/api/tickets/${ticket!.id}`).set('Cookie', cookie).send(updateTicket).expect(400);
  
});