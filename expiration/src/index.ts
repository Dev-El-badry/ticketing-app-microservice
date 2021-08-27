import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { nats } from './nats-wrapper';

const start = async () => {
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

    new OrderCreatedListener(nats.client).listen();
  } catch (error) {
    console.error(error);
  }
};

start();
