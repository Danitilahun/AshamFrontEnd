import React, { useState } from "react";
import { Box, Tab, Tabs, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import { salaryColumn } from "../../utils/tableColumns";
import DataTable from "../../components/VersatileComponents/DataTable";
import useTableData from "../../hooks/useTableData";
import BonusDialog from "../../components/BonusPenality/Bonus";
import { useAuth } from "../../contexts/AuthContext";
import useUserClaims from "../../hooks/useUserClaims";
import { Helmet } from "react-helmet";
import NewExpenseTable from "../../components/Expense/NewExpense";
import { ExportToExcel } from "../../utils/ExportToExcel";

const containerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
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

const SalaryPage = () => {
  let active = "";
  let salaryTable = [];
  let branchId = "";

  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData.active !== undefined ? userData.active : "";
    salaryTable =
      userData.salaryTable !== undefined ? userData.salaryTable : [];
    branchId = userData.id !== undefined ? userData.id : [];
  }

  const theme = useTheme();
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const staffSalaryColumn = [
    {
      field: "uniqueName",
      headerName: "Unique Name",
      flex: 0.4,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "bonus",
      headerName: "Bonus",
      flex: 0.4,
    },
    {
      field: "addbonus",
      headerName: "Give Holiday Bonus",
      flex: 0.6,
      renderCell: (params) =>
        params.row.addbonus ? (
          <BonusDialog worker={"individual"} id={params.row.id} />
        ) : (
          <div></div> // Empty space if 'addbonus' field does not exist
        ),
    },

    {
      field: "penality",
      headerName: "Penality",
      flex: 0.4,
    },
    {
      field: "fixedSalary",
      headerName: "Fixed Salary",
      flex: 0.4,
    },

    {
      field: "holidayBonus",
      headerName: "Holiday Bonus",
      flex: 0.4,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.4,
    },
  ];

  const staffSalaryColumnForNonAdmin = [
    {
      field: "uniqueName",
      headerName: "Unique Name",
      flex: 0.4,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "bonus",
      headerName: "Bonus",
      flex: 0.4,
    },

    {
      field: "penality",
      headerName: "Penality",
      flex: 0.4,
    },
    {
      field: "fixedSalary",
      headerName: "Fixed Salary",
      flex: 0.4,
    },

    {
      field: "holidayBonus",
      headerName: "Holiday Bonus",
      flex: 0.4,
    },
    {
      field: "totalCredit",
      headerName: "Total Credit",
      flex: 0.4,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 0.4,
    },
  ];

  if (!active) {
    active = "abcedafkas";
  }
  const [selectedTab, setSelectedTab] = useState(active);
  const [selectedTab2, setSelectedTabTwo] = useState(active);

  const { data: salary } = useTableData(selectedTab, "salary");
  const { data: staffSalary } = useTableData(selectedTab2, "staffSalary");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleTabChange2 = (event, newValue) => {
    setSelectedTabTwo(newValue);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Salary</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="Salary pages" />
      </Helmet>
      {active !== "abcedafkas" ? (
        <Box
          m="1.5rem 2.5rem"
          sx={{
            backgroundColor: theme.palette.background.default,
            height: "100%",
            position: "relative",
          }}
        >
          <Header title="Delivery guys Salary Table" subtitle="" />
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            style={{
              color: theme.palette.secondary[700],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            {salaryTable.map((tabData) => (
              <Tab
                key={tabData.id}
                label={tabData.name}
                value={tabData.id}
                style={{
                  color: theme.palette.secondary[300],
                  ...(selectedTab === tabData.id && {
                    color: theme.palette.secondary[100],
                    borderBottom: `5px solid ${theme.palette.grey[900]}`,
                  }),
                }}
              />
            ))}
          </Tabs>

          <div style={containerStyle}>
            <div style={flexItemStyle}></div>
            <div style={flexItemStyles}>
              {userClaims.superAdmin || userClaims.finance ? (
                <ExportToExcel
                  file={"salary"}
                  branchId={"non"}
                  id={active}
                  endpoint={"delSal"}
                  clear={false}
                  name="DeliverySalaryTable"
                />
              ) : null}
            </div>
          </div>

          {salary.length > 0 && (
            <DataTable rows={salary} columns={salaryColumn} />
          )}

          <Header title="Staff Salary Table" subtitle="" />
          <Tabs
            value={selectedTab2}
            onChange={handleTabChange2}
            variant="scrollable"
            scrollButtons="auto"
            style={{
              color: theme.palette.secondary[700],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            {salaryTable.map((tabData) => (
              <Tab
                key={tabData.id}
                label={tabData.name}
                value={tabData.id}
                style={{
                  color: theme.palette.secondary[300],
                  ...(selectedTab2 === tabData.id && {
                    color: theme.palette.secondary[100],
                    borderBottom: `5px solid ${theme.palette.grey[900]}`,
                  }),
                }}
              />
            ))}
          </Tabs>

          <div style={containerStyle}>
            <div style={flexItemStyle}></div>
            <div style={flexItemStyles}>
              {userClaims.superAdmin || userClaims.finance ? (
                <ExportToExcel
                  file={"staffSalary"}
                  branchId={branchId}
                  id={active}
                  endpoint={"staffsalary"}
                  clear={false}
                  name="StaffSalaryTable"
                />
              ) : null}
            </div>
          </div>

          {staffSalary.length > 0 && (
            <DataTable
              rows={staffSalary}
              columns={
                userClaims.admin
                  ? staffSalaryColumn
                  : staffSalaryColumnForNonAdmin
              }
            />
          )}

          <Header title="Current Expense Table" subtitle="" />

          <div style={containerStyle}>
            <div style={flexItemStyle}></div>
            <div style={flexItemStyles}>
              {userClaims.superAdmin || userClaims.finance ? (
                <ExportToExcel
                  file={"Status"}
                  branchId={branchId}
                  id={active}
                  endpoint={"sheetstatus"}
                  clear={false}
                  name="SheetStatusTable"
                />
              ) : null}
            </div>
          </div>

          {branchId ? <NewExpenseTable id={active} /> : null}
        </Box>
      ) : null}
    </>
  );
};

export default SalaryPage;
