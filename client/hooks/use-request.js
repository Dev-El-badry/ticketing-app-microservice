import { useState } from 'react';
import axios from 'axios';

export default ({url, method, body, onSuccess}) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, {...body, ...props});

      if(onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log(err, 'error from request');
      setErrors(
        <div className="alert alert-danger mt-4">
          <h4>Ooops ...</h4>
          <ul className="my-0">
            {err.response.data.errors.map(err => {
              return <li key={err.message}>{err.message}</li>;
            })}
          </ul>
        </div>
      );
    }
  };

  return {errors, doRequest};
};