import { OrderCreatedListener } from "../order-created-listener";
import {nats} from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from "@gtxticketing/common";
import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/Ticket';
const setup = async () => {
  const listener = new OrderCreatedListener(nats.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'abc'
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  return {listener, data, msg, ticket};
};

it('sets the user id of the ticket', async() => {
  const {listener, data, msg, ticket} = await setup();
  await listener.onMessage(data, msg);
  const ticketUpdated = await Ticket.findById(ticket.id);
  expect(ticketUpdated!.orderId).toEqual(data.id);
});

it('ack the message', async() => {
  const {listener, data, msg, ticket} = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async() => {
  const {listener, data, msg, ticket} = await setup();
  await listener.onMessage(data, msg);

  expect(nats.client.publish).toHaveBeenCalled();
  
  const ticketUpdatedData = JSON.parse(
    (nats.client.publish as jest.Mock).mock.calls[0][1]
  );
  
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});