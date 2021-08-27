import {OrderCompletedEvent, Subjects, Listener, OrderStatus} from '@gtxticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import {Order} from '../../models/order';
import { CancelledOrderPublisher } from '../publishers/cancelled-order-publisher';

export class ExpirationCompleteListener extends Listener<OrderCompletedEvent> {
  readonly subject: Subjects.CompletedOrder = Subjects.CompletedOrder;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCompletedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if(!order) {
      throw new Error('order not found !');
    }

    if(order!.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({status: OrderStatus.Cancelled});
    await order.save();

    await new CancelledOrderPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
          id: order.ticket.id
      }
    });

    msg.ack();
  }
}