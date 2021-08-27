import {Ticket} from '../Ticket';

it('implements optimistic concurrency control', async(done) => {
  const ticket = {
    title: "concert",
    price: 20,
    userId: "abc"
  };

  const createTicket = Ticket.build(ticket);
  await createTicket.save();

  const firstInstance = await Ticket.findById(createTicket.id);
  const secondInstance = await Ticket.findById(createTicket.id);

  firstInstance!.set({price: 30});
  secondInstance!.set({price: 40});

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return done();
  }

  throw new Error('should not reach to this point!');
});

it('increments the version number on multiple saves', async() => {
  const ticket = {
    title: "concert",
    price: 20,
    userId: "123"
  };

  const createTicket = Ticket.build(ticket);
  await createTicket.save();

  expect(createTicket.version).toEqual(0);
  await createTicket.save();
  expect(createTicket.version).toEqual(1);
  await createTicket.save();
  expect(createTicket.version).toEqual(2);
});