// IncomeSourceBar.js
import React from "react";
import IncomeBar from "./IncomeBar";
import { useTheme } from "@mui/material";

const IncomeSourceBar = ({ sourcesData }) => {
  const theme = useTheme();
  return (
    <div
      className="item"
      style={{ backgroundColor: theme.palette.background.alt }}
    >
      <h2 style={{ paddingTop: ".5rem" }}>Sources</h2>
      <span className="bottom-line"></span>
      <div className="bar-holder sources-bar-holder">
        {sourcesData &&
          sourcesData.map((data, index) => (
            <IncomeBar key={index} data={data} />
          ))}
      </div>
    </div>
  );
};

export default IncomeSourceBar;
