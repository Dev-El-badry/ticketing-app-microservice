import express, { NextFunction, Request, Response } from 'express';
import {body} from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@gtxticketing/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

import  {nats} from '../nats-wrapper';
import {CreatedOrderPublisher} from '../events/publishers/created-order-publisher';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/',
requireAuth, 
[
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) =>  mongoose.Types.ObjectId.isValid(input) )
    .withMessage('ticket id is not provided')
], validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
  const {ticketId} = req.body;
 
  const ticket = await Ticket.findById(ticketId);
  if(!ticket) {
    throw new NotFoundError();
  }

  const isReserved = await ticket!.isReserved();
  if(isReserved) {
    throw new BadRequestError('order is already reserved.');
  }

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = Order.build({
    //@ts-ignore
    ticket: ticket,
    status: OrderStatus.Created,
    expiresAt: expiration,
    userId: req.currentUser.id
  });
  await order.save();
  
  await new CreatedOrderPublisher(nats.client).publish({
    id: order.id,
    expiresAt: order.expiresAt.toISOString(),
    status: order.status,
    userId: order.userId,
    version: 0,
    // version: order.version,
    ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
    }
  });

  res.status(201).send(order);
  } catch (error) {
    next(error);
  }
});

export { router as createOrderRouter };