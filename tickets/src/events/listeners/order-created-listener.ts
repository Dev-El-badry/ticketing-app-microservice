import { Listener, OrderCreatedEvent, Subjects } from "@gtxticketing/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { UpdateTicketPublish } from "../publishers/update-ticket-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.CreatedOrder = Subjects.CreatedOrder;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if(!ticket) {
      throw new Error('ticket not found !');
    }
    ticket.set({orderId: data.id});
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