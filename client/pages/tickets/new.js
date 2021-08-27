import { useState } from "react";
import useRequest from '../../hooks/use-request';
import { useRouter } from "next/router";

const NewTicket = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const {doRequest, errors} = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      price,
      title
    },
    onSuccess: () => {router.push('/')}
  });

  const onBlur = (e) => {
    const value = parseFloat(price);

    if(isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    doRequest();
  };

  return <div>
    <form onSubmit={onSubmit}>
      {errors}

      <div className="form-group">
        <label>title:</label>
        <input className="form-control" onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="form-group">
        <label>price:</label>
        <input className="form-control" onChange={e=>setPrice(e.target.value)} onBlur={onBlur} />
      </div>

      <button className="btn btn-primary">Create new ticket</button>
    </form>
  </div>
};

export default NewTicket;