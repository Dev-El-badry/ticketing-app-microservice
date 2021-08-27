import request from 'supertest';
import {Order} from '../../models/order';
import {app} from '../../app';
import mongoose from 'mongoose';
import {OrderStatus} from '@gtxticketing/common';

it('returns a 404 when purchasing an order that does no exists', async() => {
  return request(app)
    .post('/api/payments')
    .send({orderId: new mongoose.Types.ObjectId().toHexString(), token: 'abc'})
    .set('Cookie', global.signin())
    .expect(404);
});
it('returns a 401 when purchasing an order that does not belong to the user', async() => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 20
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .send({
      orderId: order.id,
      token: 'abc'
    })
    .set('Cookie', global.signin())
    .expect(401);
});
it('returns a 400 when purchasing a cancelled order', async() => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    status: OrderStatus.Cancelled,
    price: 20
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .send({
      orderId: order.id,
      token: 'abc'
    })
    .set('Cookie', global.signin(userId))
    .expect(400);
});

it('returns a 201 with valid inputs', async() => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    status: OrderStatus.Created,
    price: 20
  });
  await order.save();
  

  await request(app)
    .post('/api/payments')
    .send({
      orderId: order.id,
      token: 'tok_visa'
    })
    .set('Cookie', global.signin(userId))
    .expect(201);
});