import request from 'supertest';
import {app} from '../../app';
import {Ticket} from '../../models/ticket';
import mongoose from 'mongoose';
it('fetches the order', async() => {
  const user = global.signin();

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test ticket',
    price: 9.99
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
    .get(`/api/orders/${fetchOrder.id}`)
    .send()
    .set('Cookie', user)
    .expect(200);
});

it('returns an errors if one user tries to fetch another users order', async() => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test ticket',
    price: 9.99
  });
  await ticket.save();

  const {body: fetchOrder} = await request(app)
    .post('/api/orders')
    .send({
      ticketId: ticket.id
    })
    .set('Cookie', global.signin())
    .expect(201);

  await request(app)
    .get(`/api/orders/${fetchOrder.id}`)
    .send()
    .set('Cookie', global.signin())
    .expect(401);
});