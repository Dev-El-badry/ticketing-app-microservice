import { TicketUpdatedEvent, Listener, Subjects, NotFoundError } from "@gtxticketing/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.UpdatedTicket = Subjects.UpdatedTicket;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent({id: data.id, version: data.version});
    if(!ticket) {
      throw new NotFoundError();
    }

    const {title, price} = data;
    ticket.set({title, price});
    await ticket.save();

    msg.ack();
  }
}