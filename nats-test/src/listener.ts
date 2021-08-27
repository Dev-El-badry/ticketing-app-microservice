import { connect, Message, Stan } from "node-nats-streaming";
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from "./events/ticket-created-listener";
console.clear();

const stan = connect("ticketing", randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

new TicketCreatedListener(stan).listen();

// stan.on("connect", () => {
//   console.log('Listner connect with NATS');

//   stan.on('close', () => {
//     console.log('NATS connection closed !');
//     process.exit();
//   });

//   const options = stan.subscriptionOptions()
//     .setManualAckMode(true)
//     .setDeliverAllAvailable()
//     .setDurableName('acounting-service');

//   const subscription = stan.subscribe("ticket:publish", "order-service-queue-group", options);
//   subscription.on("message", (msg: Message) => {
//     const data = msg.getData();

//     if(typeof data === 'string') {
//       console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
//     }
//   })
// });

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

