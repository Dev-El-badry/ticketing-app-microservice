import { NotFoundError, requireAuth, validateRequest, NoAuthorized, OrderStatus } from '@gtxticketing/common';
import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import {Payment} from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import {nats} from '../nats-wrapper';
const router= express.Router();

router.post(
  '/',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('tocket not bet empty'),
    body('orderId').not().isEmpty().withMessage('order id not be empty')
  ],
  validateRequest,
  async(req: Request, res: Response) => {
    const {token, orderId} = req.body;
    const order = await Order.findById(orderId);
    if(!order) {
      throw new NotFoundError();
    }

    if(order.userId !== req.currentUser.id) {
      throw new NoAuthorized();
    }

    if(order.status === OrderStatus.Cancelled) {
      throw new Error('can\'t pay for an cancelled order');
    }

   
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token
    });

    const payment = Payment.build({
      orderId: order.id,
      stripeId: charge.id
    });
    await payment.save();
    
    new PaymentCreatedPublisher(nats.client).publish({
      id: payment.id,
      orderId,
      stripeId: payment.stripeId
    });

    res.status(201).send({paymentId: payment.id});
  }
)

export {router as newPaymentRouter};