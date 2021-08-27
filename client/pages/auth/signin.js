import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router'

export default () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {errors, doRequest} = useRequest({url: '/api/users/signin', method: 'post', body: {
    email, password
  }, onSuccess: () => { router.push('/') }});

  const onSubmit = async event => {
    event.preventDefault();

    doRequest();
  };

  return <form onSubmit={onSubmit} className="form-group">
    <div  className="mb-3" >
      <label>Email Address</label>
      <input name="email" className="form-control" onChange={e => setEmail(e.target.value)} />
    </div>
    <div  className="mb-3" >
      <label>Password</label>
      <input name="password" type="password" className="form-control" onChange={e => setPassword(e.target.value)} />
    </div>
      <button className="btn btn-primary" type="submit">Sign in</button>

    {errors}
  </form>;
}