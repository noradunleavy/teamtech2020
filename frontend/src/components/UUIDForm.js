import React, { useContext } from 'react';
import { UserContext } from './UserContext';

const Form = () => {
  const user = useContext(UserContext);

  return (
    <div className="user-form">
      <div className="input-item">
        <label className="label">Update Uuid:</label>
        <input
          className="input"
          onChange={e => user.setUuid(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Form;
