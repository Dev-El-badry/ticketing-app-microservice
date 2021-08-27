import {TicketCreatedEvent} from '@gtxticketing/common';
import {TicketCreatedListener} from '../ticket-created-listener';
import {nats} from '../../../nats-wrapper';
import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/ticket';

const setup = async() => {
  //create a instance of the listener
  const listener = new TicketCreatedListener(nats.client);
  //create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 200,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString()
  };
  //create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return {listener, data, msg};
};

it('creates and save a ticket', async() => {
  const {listener, data, msg} = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  //write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.id).toEqual(data.id);
});

it('acks the message', async() => {
  const {listener, data, msg} = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  //write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});