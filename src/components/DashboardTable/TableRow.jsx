// TableRow.js
import { useTheme } from "@mui/material";
import React from "react";

const TableRow = ({ data, type }) => {
  const theme = useTheme();
  const color =
    data.Status < 0 ? "red" : data.Status === 0 ? "yellow" : "green";

  // Define padding for the div
  const statusStyle = {
    padding: "5px", // Adjust the padding as needed
    textAlign: "center",
    color,
    borderRadius: "10px", // Background color based on data.Status
  };

  return (
    <tr
      style={{
        // color: theme.palette.secondary[200],

        backgroundColor: theme.palette.background.alt,
        marginBottom: "0.3rem",
      }}
    >
      <td data-cell="Branch">{data.BranchName}</td>
      {/* <td data-cell="Type">{type}</td> */}
      {/* <td data-cell="Asbeza N">{data.Asbeza_N}</td> */}
      <td data-cell="Asbeza P">{data.Asbeza_P}</td>
      {/* <td data-cell="Card C">{data.CardCollect}</td> */}
      {/* <td data-cell="Card Fee">{data.CardFee}</td> */}
      <td data-cell="Card D">{data.CardDistribute}</td>
      {/* <td data-cell="Water C">{data.WaterCollect}</td> */}
      <td data-cell="Water D">{data.WaterDistribute}</td>
      {/* <td data-cell="Wifi C">{data.WifCollect}</td> */}
      <td data-cell="Wifi D">{data.WifiDistribute}</td>
      <td data-cell="Hotel">{data.HotelProfit}</td>
      <td data-cell="Total Inc">{data.TotalProfit}</td>
      <td data-cell="Total Exp">{data.TotalExpense}</td>
      <td data-cell="Status">
        <div style={statusStyle}>{data.Status}</div>
      </td>
    </tr>
  );
};

export default TableRow;
