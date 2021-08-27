import Link from 'next/link';

const LandingPage = ({currentUser, tickets}) => {
  const ticketList = tickets.map(ticket => {
    return <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="tickets/[ticketId]" as={`tickets/${ticket.id}`}>
        <a className="nav-link">view</a>
        </Link>
      </td>
    </tr>
  })

  return <div>
    <Link href="/tickets/new">
      <button className="btn btn-primary mt-4">
        Create new ticket
      </button>
    </Link>
    
    <h1 className="mt-4">Tickets</h1>
    <table className="table">
      <thead>
        <tr>
          <th>title</th>
          <th>price</th>
          <th>action</th>
        </tr>
      </thead>

      <tbody>
        {ticketList}
      </tbody>
    </table>
  </div>
};

LandingPage.getInitialPage = async (context, client, currentUser) => {
  const {data} = await client.get('/api/tickets');
  return {tickets : data};
};

export default LandingPage;