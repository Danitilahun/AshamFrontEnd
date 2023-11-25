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
import { useTheme } from "@emotion/react";
import { Helmet } from "react-helmet";
import { ExportToExcel } from "../../utils/ExportToExcel";
import useUserClaims from "../../hooks/useUserClaims";
import { useAuth } from "../../contexts/AuthContext";
const TablesPage = () => {
  const params = useParams();
  const sheetId = params.sheet;
  const branchId = params.id;
  const theme = useTheme();

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

  const { data: table } = useTableData(customID);
  const { data: tableSummary } = useTableData(customID2);
  const { data: tableDaySummary } = useTableData(customID3);
  const { user } = useAuth();
  const userClaim = useUserClaims(user);
  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "1rem",
    // backgroundColor: "green",
  };

  const flexItemStyle = {
    flex: 13,
  };

  const flexItemStyles = {
    flex: 1,
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sheet tables </title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of sheet table" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <Header
          title="Table"
          subtitle="Entire list of tables"
          tableId={table.length > 0 ? customID : "None"}
        />

        <TableTab
          tableDate={tableDate}
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          from="table"
        />

        {table.length > 0 && <DataTable rows={table} columns={columns} />}

        <Header title="Summery Daily Table" subtitle="" />

        {/* DataTable component for daily summary table */}
        <div style={containerStyle}>
          <div style={flexItemStyle}></div>
          <div style={flexItemStyles}>
            {userClaim.superAdmin ? (
              <ExportToExcel
                file={"tables"}
                branchId={branchId}
                id={customID3}
                endpoint={"dailySummeryForSheet"}
                clear={false}
                name="DailySummeryForSheet"
              />
            ) : null}
          </div>
        </div>
        {tableDaySummary.length > 0 && (
          <DataTable rows={tableDaySummary} columns={summery2Column} />
        )}

        <Header title="Summery Person Table" subtitle="" />

        <div style={containerStyle}>
          <div style={flexItemStyle}></div>
          <div style={flexItemStyles}>
            {userClaim.superAdmin ? (
              <ExportToExcel
                file={"tables"}
                branchId={branchId}
                id={customID2}
                endpoint={"delveryGuyTables"}
                clear={false}
                name="DeliveryGuys15DayWorkSummery"
              />
            ) : null}
          </div>
        </div>
        {/* DataTable component for person summary table */}

        {tableSummary.length > 0 && (
          <DataTable rows={tableSummary} columns={columns} />
        )}
      </Box>
    </>
  );
};

export default TablesPage;
