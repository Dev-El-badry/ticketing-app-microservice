import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

//routers
import { createOrderRouter } from './routes/create';
import { indexOrdersRouter } from './routes/index';
import {showOrderRouter} from './routes/show';
import { deleteOrderRouter } from './routes/delete';
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
const PREFIX_URL = '/api/orders';
app.use(PREFIX_URL, createOrderRouter);
app.use(PREFIX_URL, indexOrdersRouter);
app.use(PREFIX_URL, showOrderRouter);
app.use(PREFIX_URL, deleteOrderRouter);

app.all('*', (req, res, next) => {
  throw new NotFoundError();
});
//middleware
app.use(errorHandler);

export { app };
