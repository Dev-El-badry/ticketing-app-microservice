import { app } from './app';
import mongoose from 'mongoose';

const port = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('must jwt key not be empty');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('connected to mongodb !!');
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log(`Server running at: ${port}!`);
  });
};

start();
