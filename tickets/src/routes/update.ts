import { BadRequestError, NoAuthorized, NotFoundError, requireAuth, validateRequest } from '@gtxticketing/common';
import express, {Request, Response } from 'express';
import { body} from 'express-validator';
import { UpdateTicketPublish } from '../events/publishers/update-ticket-publisher';
import { Ticket } from '../models/Ticket';
import { nats } from '../nats-wrapper';

const router = express.Router();

router.put('/:id', requireAuth, [
  body('title').not().isEmpty().withMessage('title is required'),
  body('price').isFloat({gt: 0}).withMessage('price must be greater that 0')
], validateRequest, async(req: Request, res: Response) => {
  const {id} = req.params;
  const {title, price} = req.body;
  const updateTicket = {title, price, userId: req.currentUser.id};
  const ticket = await Ticket.findById(id);
  if(!ticket) {
    throw new NotFoundError();
  }

  if(ticket.userId !== req.currentUser.id) {
    throw new NoAuthorized();
  }

  if(ticket.orderId) {
    throw new BadRequestError('cannot edit a reserved ticket!');
  }

  ticket.set(updateTicket);
  await ticket.save();

  await new UpdateTicketPublish(nats.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  res.status(201).send(ticket);
});

export {router as updateTicketRouter};