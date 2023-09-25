import React from "react";
import BranchBar from "./BranchBar"; // Import the BranchBar component
import { useTheme } from "@mui/material";

const BranchIncomeBar = ({ incomeBarData }) => {
  const theme = useTheme();
  return (
    <div
      className="item"
      style={{
        backgroundColor: theme.palette.background.alt,
      }}
    >
      <h2 style={{ paddingTop: ".5rem" }}>Branch Income</h2>
      <span className="bottom-line"></span>
      <div className="bar-holder income-bar-holder">
        {incomeBarData &&
          incomeBarData.map((data) => (
            <BranchBar key={data.uniqueName} data={data} />
          ))}
      </div>
    </div>
  );
};

export default BranchIncomeBar;
