import { Listener, TicketCreatedEvent, Subjects } from "@gtxticketing/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.CreatedTicket = Subjects.CreatedTicket;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const {id, title, price} = data;
    
    const ticket = Ticket.build({
      id,
      title,
      price
    });
    await ticket.save();

    msg.ack();
  }
}