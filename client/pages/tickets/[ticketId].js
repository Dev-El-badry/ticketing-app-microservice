import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const ShowTicket = ({ticket}) => {
  const router = useRouter();
  const {doRequest, errors} = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: data => router.push('/orders/[orderId]', `/orders/${data.id}`)
  });


  return <div>
    <h2 className="mb-4 mt-4">show ticket</h2>
    {errors}
    <h3>Title: {ticket.title}</h3>
    <h4>Price: {ticket.price}</h4>

    <button className="btn btn-primary" onClick={() => doRequest()}>
      Purchase
    </button>
  </div>
};

ShowTicket.getInitialPage = async(context, client, currentUser) => {
  const {ticketId} = context.query;
  const {data} = await client.get(`/api/tickets/${ticketId}`);
  
  return {ticket: data};
};

export default ShowTicket;