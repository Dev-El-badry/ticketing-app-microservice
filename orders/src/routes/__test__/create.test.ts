import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';

import {Ticket} from '../../models/ticket';
import {Order, OrderStatus} from '../../models/order';

import {nats} from '../../nats-wrapper';

it('returns error if ticket does not exists', async () => {
  const ticketId = mongoose.Types.ObjectId();

  const response = await request(app)
    .post('/api/orders')
    .send({ticketId: ticketId})
    .set('Cookie', global.signin())
    .expect(404);
});

it('returns an error if ticket it already reserved', async() => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'fake ticket',
    price: 29
  });
  await ticket.save();
  
  const order = Order.build({
    userId: 'abc',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket
  });
  await order.save();
  
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(400);

});

it('reserves a ticket', async() => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'fake ticket',
    price: 29
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .send({ticketId: ticket.id})
    .set('Cookie', global.signin())
    .expect(201);
});

it('emits an order created event', async() => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'fake ticket',
    price: 29
  });
  await ticket.save();

  const response = await request(app)
    .post('/api/orders')
    .send({ticketId: ticket.id})
    .set('Cookie', global.signin())
    .expect(201);
  
  expect(nats.client.publish).toHaveBeenCalled();
});