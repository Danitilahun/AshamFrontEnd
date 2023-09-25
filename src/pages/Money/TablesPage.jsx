import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import Header from "../../components/VersatileComponents/Header";
import TableTab from "../../components/DashboardTable/TableTab";
import DataTable from "../../components/VersatileComponents/DataTable";
import useTableData from "../../hooks/useTableData";
import useTableDate from "../../hooks/useTableDate";
import generateCustomID from "../../utils/generateCustomID";
import { columns, summery2Column } from "../../utils/tableColumns";

const TablesPage = () => {
  const params = useParams();
  const sheetId = params.sheet;
  const branchId = params.id;

  const tableDate = useTableDate(sheetId);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const lastRowIndex = tableDate.length - 1;
    setSelectedTab(parseInt(lastRowIndex));
  }, [tableDate]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const customID = generateCustomID(
    `${tableDate[selectedTab]}-${sheetId}-${branchId}`
  );
  const customID2 = generateCustomID(`${sheetId}-${branchId}`);
  const customID3 = generateCustomID(`${sheetId}-${branchId}-16day`);

  console.log("customID", customID3);
  const { data: table } = useTableData(customID);
  const { data: tableSummary } = useTableData(customID2);
  const { data: tableDaySummary } = useTableData(customID3);

  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Table"
        subtitle="Entire list of tables"
        tableId={table.length > 0 ? customID : "None"}
      />
      <TableTab
        tableDate={tableDate}
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
      />

      {table.length > 0 && <DataTable rows={table} columns={columns} />}

      <Header title="Summery Daily Table" subtitle="" />

      {/* DataTable component for daily summary table */}

      {tableDaySummary.length > 0 && (
        <DataTable rows={tableDaySummary} columns={summery2Column} />
      )}

      <Header title="Summery Person Table" subtitle="" />

      {/* DataTable component for person summary table */}

      {tableSummary.length > 0 && (
        <DataTable rows={tableSummary} columns={columns} />
      )}
    </Box>
  );
};

export default TablesPage;
