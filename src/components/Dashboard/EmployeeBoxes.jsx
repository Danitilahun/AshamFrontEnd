// EmployeeBoxes.js
import React from "react";

const EmployeeBoxes = ({ activeEmployees }) => {
  return (
    <div className="boxes">
      <div className="box">
        <div className="ind-box"></div>
        <p>Active</p>
        <span>{activeEmployees} Active delivery guys</span>
      </div>

      <div className="box">
        <div className="ind-box"></div>
        <p>Inactive</p>
      </div>
    </div>
  );
};

export default EmployeeBoxes;
