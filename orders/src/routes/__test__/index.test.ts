import request from 'supertest';
import {Ticket} from '../../models/ticket';
import mongoose from 'mongoose';
import {app} from '../../app';

const createTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test ticket',
    price: 99.9
  });
  await ticket.save();

  return ticket;
};
it('fetch orders for an particular user', async() => {
  //create three tickets
  const firstTicket = await createTicket();
  const secondTicket = await createTicket();
  const threeTicket = await createTicket();

  const oneUser = global.signin();
  const twoUser = global.signin();

  //create one order as user #1
  await request(app)
    .post('/api/orders')
    .send({ticketId: firstTicket.id})
    .set('Cookie', oneUser)
    .expect(201);
  
  //create two orders as user #2
  const {body: oneOrder} = await request(app)
    .post('/api/orders')
    .send({ticketId: secondTicket.id})
    .set('Cookie', twoUser)
    .expect(201);

  const {body: twoOrder} = await request(app)
    .post('/api/orders')
    .send({ticketId: threeTicket.id})
    .set('Cookie', twoUser)
    .expect(201);
  
  // make request to get orders for user#2
  const response = await request(app)
    .get('/api/orders')
    .send()
    .set('Cookie', twoUser)
    .expect(200);
  
  //make sure we only got the orders for user#2
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(oneOrder.id);
  expect(response.body[1].id).toEqual(twoOrder.id);

  expect(response.body[0].ticket.id).toEqual(oneOrder.ticket.id);
  expect(response.body[1].ticket.id).toEqual(twoOrder.ticket.id);
});