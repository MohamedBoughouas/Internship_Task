import React from "react";
import { FaRegCheckCircle } from "react-icons/fa"; //import check circle icon
import "../globals.css";

const Alert = () => {
  return (
    <div className="alertBox">
      <FaRegCheckCircle style={{ fontSize: "60px" }} />
      <p>Done</p>
    </div>
  );
};

export default Alert;
