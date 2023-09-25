// ActiveDeliveryPercentage.js
import React from "react";
import CircularProgressChart from "./CircularProgressChart";
import EmployeeBoxes from "./EmployeeBoxes";
import { useTheme } from "@mui/material";

const ActiveDeliveryPercentage = ({ dashTotalData }) => {
  const theme = useTheme();
  const activePercentage =
    dashTotalData.totalEmployees !== "Not Aviable" &&
    dashTotalData.totalEmployees > 0
      ? (
          (100 * dashTotalData.activeEmployees) /
          dashTotalData.totalEmployees
        ).toFixed()
      : 0;

  return (
    <div
      className="chart-container"
      style={{
        backgroundColor: theme.palette.background.alt,
      }}
    >
      <h2>Delivery Guys</h2>
      <div
        className="chart"
        style={{
          // color: theme.palette.secondary[200],

          backgroundColor: theme.palette.background.alt,
        }}
      >
        <CircularProgressChart activePercentage={activePercentage} />
        <EmployeeBoxes activeEmployees={dashTotalData.activeEmployees} />
      </div>
    </div>
  );
};

export default ActiveDeliveryPercentage;
