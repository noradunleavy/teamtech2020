import React, { useContext } from "react";
import { UserContext } from "./UserContext";

// This component displays name from Context
const UUID = () => {
  const user = useContext(UserContext);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2 className="is-size-4">
        <h4> {user.uuid} </h4>
        <br />
      </h2>
    </div>
  );
};

export default UUID;
