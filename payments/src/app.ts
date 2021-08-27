import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

//routers
import { newPaymentRouter } from './routes/new';

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
const PREFIX_URL = '/api/payments';
app.use(PREFIX_URL, newPaymentRouter);

app.all('*', (req, res, next) => {
  throw new NotFoundError();
});
//middleware
app.use(errorHandler);

export { app };
