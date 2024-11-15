import React from "react";
import "./Address.css"; // Import file CSS

const Address = ({ address }) => {
  return (
    <div className="address-container">
      <p className="address-text">Bạn đang ở: {address || "..."}</p>
    </div>
  );
};

export default Address;
