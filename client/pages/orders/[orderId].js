import { useState, useEffect } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import {useRouter} from 'next/router';

const ShowOrder = ({order, currentUser}) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const {doRequest, errors} = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (data) => router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timer = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [order]);

  if(timeLeft < 0) {
    return <div>Order expired</div>
  }

  return <div>

    <h2>Time left to pay: {timeLeft} seconds</h2>
    {errors}
    <StripeCheckout
        token={({ id }) => doRequest({token: id })}
        stripeKey="pk_test_51JSXGgKsKJOAN1GHFLdD9wFfxpimDv64HwNKGYKThtlf7XkBD244MFoAhwo4YbHtkpP9Ioc9or71iixmIca3pM9b00NMGI4wiZ"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
  </div>
  ;
};

ShowOrder.getInitialPage = async (context, client, currentUser) => {
  const {orderId} = context.query;
  const {data} = await client.get(`/api/orders/${orderId}`);
  return {order: data};
};

export default ShowOrder;