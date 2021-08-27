const ShowOrders = ({orders}) => {
  let ordersList;
  if(orders) {
    ordersList = orders.map(order => {
      return (
        <tr>
          <td>{order.ticket.title}</td>
          <td>{order.ticket.price}</td>
          <td>{order.status}</td>
        </tr>
      )
    });
  }
    

  return (
    <div>
      <h1 className="mb-4">show orders</h1>

      <table className="table">
        <thead>
          <th>ticket title</th>
          <th>ticket price</th>
          <th>status</th>
        </thead>

        <tbody>
          {ordersList}
        </tbody>
      </table>
    </div>
  );
};

ShowOrders.getInitialPage = async (context, client, currentUser) => {
  const { data } = await client.get('/api/orders');
  console.log(data);
  return { orders: data };
};

export default ShowOrders;