// TableRow.js
import { useTheme } from "@mui/material";
import React from "react";

const TableRow = ({ data, type }) => {
  const theme = useTheme();
  const color =
    data.Status < 0 ? "#F93C3C" : data.Status === 0 ? "#DDBD4C" : "#4ADB47";

  return (
    <tbody>
      <tr
        style={{
          backgroundColor: theme.palette.background.alt,
          marginBottom: "0.3rem",
        }}
      >
        <td data-cell="Branch">{data.BranchName}</td>
        <td data-cell="Asbeza P">{data.Asbeza_P?.toFixed(2)}</td>
        <td data-cell="Card D">{data.CardDistribute}</td>
        <td data-cell="Water D">{data.WaterDistribute}</td>
        <td data-cell="Wifi D">{data.WifiDistribute}</td>
        <td data-cell="Hotel">{data.HotelProfit?.toFixed(2)}</td>
        <td data-cell="Total Inc">{data.TotalProfit?.toFixed(2)}</td>
        <td data-cell="Total Exp">{data.TotalExpense?.toFixed(2)}</td>
        <td data-cell="Status" style={{ color: color }}>
          {data.Status?.toFixed(2)}
        </td>
      </tr>
    </tbody>
  );
};

export default TableRow;
