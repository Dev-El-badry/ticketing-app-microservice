import { NotFoundError, requireAuth } from '@gtxticketing/common';
import express, {Request, Response} from 'express';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.get('/:id', requireAuth, async(req: Request, res: Response) => {
  const {id} = req.params;
  const ticket = await Ticket.findById(id);
  if(!ticket) {
    throw new NotFoundError();
  }

  res.status(201).send(ticket);
})

export { router as showTicketRouter };