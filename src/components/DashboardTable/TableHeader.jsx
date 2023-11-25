// TableHeader.js
import { useTheme } from "@mui/material";
import React from "react";

const TableHeader = () => {
  const theme = useTheme();
  return (
    <thead>
      <tr
        style={{
          // color: theme.palette.secondary[200],
          backgroundColor: theme.palette.background.alt,
        }}
      >
        <th>Branch</th>
        <th>Asbeza P</th>
        <th>Card D</th>
        <th>Water D</th>
        <th>Wifi D</th>
        <th>Hotel</th>
        <th>Total Inc</th>
        <th>Total Exp</th>
        <th>Status</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
