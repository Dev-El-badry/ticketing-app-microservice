import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

//routers
import { indexTicketRouter } from './routes/index';
import { createTicketRouter } from './routes/create';
import {updateTicketRouter} from './routes/update';
import {showTicketRouter} from './routes/show';

//middleware
import { currentUser, errorHandler, NotFoundError } from '@gtxticketing/common';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

//check if is allowed to be here
app.use(currentUser);
const PREFIX_URL = '/api/tickets';
app.use(PREFIX_URL, indexTicketRouter);
app.use(PREFIX_URL, createTicketRouter);
app.use(PREFIX_URL, updateTicketRouter);
app.use(PREFIX_URL, showTicketRouter);

app.all('*', (req, res, next) => {
  throw new NotFoundError();
});
//middleware
app.use(errorHandler);

export { app };
