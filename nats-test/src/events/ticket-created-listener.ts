import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from './subjects';
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>  {
  readonly subject: Subjects.CreateTicket = Subjects.CreateTicket;
  queueGroupName: string = 'ticket-service-queue';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(`Event Received ${this.subject} / ${this.queueGroupName}`);
    console.log(`data: 
      id: ${data.id}
      title: ${data.title}
      price: ${data.price}
    `);

    msg.ack();
  }
}