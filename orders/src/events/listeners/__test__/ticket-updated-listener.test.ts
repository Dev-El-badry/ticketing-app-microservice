import mongoose from 'mongoose';
import {Ticket} from '../../../models/ticket';
import { nats } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import {TicketUpdatedEvent} from '@gtxticketing/common';
import {TicketUpdatedListener} from '../ticket-updated-listener';

const setup = async() => {
  //create instance of the listener
  const listener = new TicketUpdatedListener(nats.client);
  //create and save ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket',
    price: 200
  });
  await ticket.save();
  //creat a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'new ticket',
    price: 200,
    version: ticket.version+1,
    userId: new mongoose.Types.ObjectId().toHexString()
  };
  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  
  return {listener, data, msg, ticket};
};

it('finds, updates, and saves a ticket', async () => {
  const {listener, data, msg, ticket} = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async() => {
  const {listener, data, msg, ticket} = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if event has a skipped version number', async() => {
  const {listener, data, msg, ticket} = await setup();
  data.version = 100;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});