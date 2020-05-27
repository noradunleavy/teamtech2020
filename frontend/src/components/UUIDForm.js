import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import "./styles.css"

const Form = () => {
  const user = useContext(UserContext);

  return (
    <div class="form-group">
      <span >uuid:</span>
        <input class="form-field" type="text" placeholder="please input your uuid of 64 characters in length" onChange={e => user.setUuid(e.target.value)}/>
    </div>
  );
};

export default Form;