import { OrderCancelledListener } from "../order-cancelled-listener";
import {nats} from '../../../nats-wrapper';
import { OrderCancelledEvent } from "@gtxticketing/common";
import mongoose from 'mongoose';
import {Ticket} from '../../../models/Ticket';
import {Message} from 'node-nats-streaming';  

const setup = async () => {
  const listener = new OrderCancelledListener(nats.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'movie',
    price: 40,
    userId: new mongoose.Types.ObjectId().toHexString()
  });
  ticket.set({orderId})
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version:0,
    ticket: {
      id: ticket.id,
    }
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  return {listener, data, ticket, msg};
};

it('updates the ticket, publishes an event, listener', async() => {
  const {listener, data, ticket, msg} = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(data.ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(nats.client.publish).toHaveBeenCalled();
});