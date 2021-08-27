import { Listener, OrderCreatedEvent, Subjects } from "@gtxticketing/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.CreatedOrder = Subjects.CreatedOrder;
  queueGroupName = queueGroupName;

  onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime(); 
    
    expirationQueue.add({
      orderId: data.id
    }, {
      delay
    });

    msg.ack();
  }
}