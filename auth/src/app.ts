import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

//ROUTES
import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
//middleware
import { errorHandler } from '@gtxticketing/common';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

const PREFIX_URL = '/api/users';

app.use(PREFIX_URL, currentUserRouter);
app.use(PREFIX_URL, signUpRouter);
app.use(PREFIX_URL, signInRouter);
app.use(PREFIX_URL, signOutRouter);

//middleware
app.use(errorHandler);

export { app };
