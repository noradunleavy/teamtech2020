import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import "./styles.css"

import API from '../api';

const Form = () => {
  const user = useContext(UserContext);

  async function handleInputChange(input) {
    let result = null
    const myAPI = new API({url: 'https://teamtech2020.herokuapp.com'})
    myAPI.createEntity({ name: 'get'})
    await myAPI.endpoints.get.username({username: input})
      .then(response => result = response.data);
    
    if(result !== "No matches") {
      let uuid = result["uuid"]
      user.setUuid(uuid)
    }
  }

  return (
    <div className="form-group">
      <span className = "uuid-prompt">Username:</span>
        <input class="form-field" type="text" placeholder="Please input your username" onChange={e => handleInputChange(e.target.value)}/>
    </div>
  );
};

export default Form;