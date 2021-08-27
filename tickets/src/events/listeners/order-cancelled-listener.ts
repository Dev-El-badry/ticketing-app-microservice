import { Subjects, OrderCancelledEvent,  Listener} from '@gtxticketing/common';
import { queueGroupName } from './queue-group-name';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../models/Ticket';
import { UpdateTicketPublish } from '../publishers/update-ticket-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.CancelledOrder = Subjects.CancelledOrder;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if(!ticket) {
      throw new Error('ticket not found !');
    }

    ticket.set({orderId: undefined});
    await ticket.save();

    await new UpdateTicketPublish(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId
    });

    msg.ack();
  }
}