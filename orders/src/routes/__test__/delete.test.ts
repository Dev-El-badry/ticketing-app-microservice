import request from 'supertest';
import {Ticket} from '../../models/ticket';
import {app} from '../../app';
import {nats} from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async() => {
  const user = global.signin();

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'fake ticket',
    price: 99.9
  });
  await ticket.save();

  const {body: fetchOrder} = await request(app)
    .post('/api/orders')
    .send({
      ticketId: ticket.id
    })
    .set('Cookie', user)
    .expect(201);
  
  await request(app)
    .delete(`/api/orders/${fetchOrder.id}`)
    .send()
    .set('Cookie', user)
    .expect(204);
});

it('emits an order cancelled event', async() => {
  const user = global.signin();

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'fake ticket',
    price: 99.9
  });
  await ticket.save();

  const {body: fetchOrder} = await request(app)
    .post('/api/orders')
    .send({
      ticketId: ticket.id
    })
    .set('Cookie', user)
    .expect(201);
  
  await request(app)
    .delete(`/api/orders/${fetchOrder.id}`)
    .send()
    .set('Cookie', user)
    .expect(204);
  
  expect(nats.client.publish).toHaveBeenCalled();
});