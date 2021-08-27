import {Order} from '../../../models/order';
import {OrderStatus, OrderCancelledEvent, OrderCreatedEvent} from '@gtxticketing/common';
import {nats} from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../order-cancelled-listener';


const setup = async() => {
  const listener = new OrderCancelledListener(nats.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: 'abc',
    version: 0,
    status: OrderStatus.Created,
    price: 20
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'abc'
    }
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {listener, data, msg};
};

it('updates the status of order', async() => {
  const {listener, data, msg} = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async() => {
  const {listener, data, msg} = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});