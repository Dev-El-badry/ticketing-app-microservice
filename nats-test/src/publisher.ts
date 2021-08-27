import { connect } from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publish';
console.clear();
const stan = connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async() => {
  const data = {
    id: '123',
    title: 'ticket',
    price: 29
  };

  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish(data);
});
