import { app } from './app';
import mongoose from 'mongoose';
import { nats } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complate-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const port = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('must jwt key not be empty');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('mongo uri is invalid');
  }

  if (!process.env.NATS_URI) {
    throw new Error('nats uri is invalid');
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('nats cluster id is invalid');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('nats client id is invalid');
  }

  try {
    await nats.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URI);
    nats.client.on("close", () => {
      console.log("NATS connection closed.");
      process.exit();
    });
    process.on("SIGINT", () => { nats.client.close() });
    process.on("SIGTERM", () => { nats.client.close() });

    new TicketCreatedListener(nats.client).listen();
    new TicketUpdatedListener(nats.client).listen();
    new ExpirationCompleteListener(nats.client).listen();
    new PaymentCreatedListener(nats.client).listen();

    await mongoose.connect(process.env.MONGO_URI, {
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
