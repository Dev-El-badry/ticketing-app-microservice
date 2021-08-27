import express, {Request, Response} from 'express';
import {Order} from '../models/order';
import {NoAuthorized, NotFoundError} from '@gtxticketing/common';

const router = express.Router();

router.get('/:orderId', async(req: Request, res: Response) => {
  const {orderId} = req.params;

  const order = await Order.findById(orderId).populate('ticket');
  if(!order) {
    throw new NotFoundError();
  }

  if(order.userId !== req.currentUser.id) {
    throw new NoAuthorized();
  }

  res.send(order);
});

export {router as showOrderRouter };