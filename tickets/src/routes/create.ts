import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@gtxticketing/common';
import {Ticket } from '../models/Ticket';
import { CreateTicketPublisher } from '../events/publishers/create-ticket-publisher';  
import { nats } from '../nats-wrapper'; 

const router = express.Router();

router.post(
  '/',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('title is required'),
    body('price').not().isEmpty().isFloat({gt: 0}).withMessage('price must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {title, price} = req.body;
    const createTicket = {
      title,
      price,
      userId: req.currentUser.id
    };

    const createdTicket = Ticket.build(createTicket);
    await createdTicket.save();

    await new CreateTicketPublisher(nats.client).publish({
      id: createdTicket.id,
      title: createdTicket.title,
      price: createdTicket.price,
      userId: createdTicket.userId,
      version: createdTicket.version
    });

    res.status(201).send(createdTicket);
  }
)

export {router as createTicketRouter};