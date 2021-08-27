import {app} from '../../app';
import request from 'supertest';
import { Ticket } from '../../models/Ticket';
import {nats} from '../../nats-wrapper';

//check if has a route handle listening to /api/tickets for post requests
it('if has a route handle listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

//can only be accessed if the user is signed in
it('can only be accessed it the user is signed in', async() => {
  const response = await request(app).post('/api/tickets').send({}).expect(401);
})

//return a status other than 401 if the user is signed in
it('return a status other than 401 if the user is signed in', async() => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

//return an error if an invalid title is provided
it('return an error if an invalid title is provided', async() => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
    .send({
      price: 1,
      title: ''
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400);
});

//returns an error if an invalid price is provided
it('returns an error if an invalid price is provided', async() => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ticket',
      price: -1
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'ticket'
    })
    .expect(400);
});

it('publishes an event', async () => {
  const title = 'asldkfj';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(nats.client.publish).toHaveBeenCalled();
});

//creates ticket with valid inputs
it('creates ticket with valid inputs', async() => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const createTicket = {
    title: 'first ticket',
    price: 20
  };
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(createTicket)
    .expect(201);
  
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(createTicket.title);
  expect(tickets[0].price).toEqual(createTicket.price);
});


