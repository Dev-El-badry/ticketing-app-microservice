import {Ticket} from '../../../models/ticket';
import {Order} from '../../../models/order';
import { ExpirationCompleteListener } from '../expiration-complate-listener';
import {nats} from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderCompletedEvent, OrderStatus } from '@gtxticketing/common';
import {Message} from 'node-nats-streaming';
const setup = async() => {
  const listener = new ExpirationCompleteListener(nats.client);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'abc',
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  const data: OrderCompletedEvent['data'] = {
    orderId: order.id
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  return {listener, order, data, msg};
};

it('updates the order status to cancelled', async() => {
  const {listener, order, data, msg} = await setup();
  await listener.onMessage(data, msg);

  const updateOrder = await Order.findById(order.id);
  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});
it('emit an OrderCancelled event', async() => {
  const {listener, order, data, msg} = await setup();
  await listener.onMessage(data, msg);

  expect(nats.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse((nats.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
});
it('ack the message', async() => {
  const {listener, order, data, msg} = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});