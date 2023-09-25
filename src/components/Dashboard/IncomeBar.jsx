import React from "react";

const IncomeBar = ({ data }) => {
  return (
    <div className="bar-container">
      <div
        className="bar"
        style={{
          height: data.Height + "%",
          background: `var(--color${data.Color})`,
        }}
      >
        <span>{data.Amount}</span>
      </div>
      <p>{data.Name}</p>
    </div>
  );
};

export default IncomeBar;
