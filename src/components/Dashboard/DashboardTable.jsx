// DashboardTable.js
import React from "react";
import TableHeader from "../DashboardTable/TableHeader";
import TableRow from "../DashboardTable/TableRow";
import { useTheme } from "@mui/material";

const DashboardTable = ({ dashTableData }) => {
  const theme = useTheme();
  return (
    <div
      className="container-bottom"
      style={{ backgroundColor: theme.palette.background.alt }}
    >
      <table className="dash-table">
        <caption>Summary</caption>
        <TableHeader />
        {dashTableData &&
          dashTableData.map((data, index) => (
            <div>
              <TableRow key={index} data={data} />
            </div>
          ))}
      </table>
    </div>
  );
};

export default DashboardTable;
