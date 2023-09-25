import React from "react";

const BranchBar = ({ data }) => {
  return (
    <div className="bar-container">
      <div
        className="bar"
        style={{
          height: data.BarHeight + "%",
          background: `var(--color${data.BarColor})`,
        }}
      >
        <span>
          <p>Income : {data.BranchIncome}</p>
          <p>Name : {data.BranchName}</p>
        </span>
      </div>
      <p>{data.uniqueName}</p>
    </div>
  );
};

export default BranchBar;
