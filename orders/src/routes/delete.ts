import { NoAuthorized, NotFoundError, requireAuth } from '@gtxticketing/common';
import express, {Request, Response} from 'express';
import { CancelledOrderPublisher } from '../events/publishers/cancelled-order-publisher';
import {Order, OrderStatus} from '../models/order';
import{nats} from '../nats-wrapper';

const router = express.Router();

router.delete('/:orderId', requireAuth, async(req: Request, res: Response) => {
  const {orderId} = req.params;
  const order = await Order.findById(orderId).populate('ticket');

  if(!order) {
    throw new NotFoundError();
  }
  if(order.userId !== req.currentUser.id) {
    throw new NoAuthorized();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  await new CancelledOrderPublisher(nats.client).publish({
    id: order.id,
    version: 0,
    ticket: {
      id: order.ticket.id
    }
  });

  res.status(204).send(order);
});

export {router as deleteOrderRouter};