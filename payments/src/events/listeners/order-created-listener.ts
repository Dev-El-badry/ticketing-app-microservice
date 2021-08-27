import { Listener, OrderCreatedEvent, Subjects } from "@gtxticketing/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from 'node-nats-streaming';
import {Order} from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.CreatedOrder = Subjects.CreatedOrder;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      version: data.version,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price
    });
    await order.save();

    msg.ack();
  }
}