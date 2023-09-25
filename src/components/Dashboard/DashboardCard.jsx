import { useTheme } from "@mui/material";
import React from "react";

const DashboardCard = ({ totalIncome, icon, title, boxShadow }) => {
  const theme = useTheme();
  return (
    <div
      className="item"
      style={{
        backgroundColor: theme.palette.background.alt,
        boxShadow: boxShadow || "none",
      }}
    >
      <div className="icon">{icon}</div>
      <div className="data">
        <h2>{totalIncome}</h2>
      </div>
      <div className="title">
        <p>{title}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
