import React, { useContext, useEffect, useState } from "react";
import { Box, Tab, Tabs, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import { salaryColumn, staffSalaryColumn } from "../../utils/tableColumns";
import DataTable from "../../components/VersatileComponents/DataTable";
import useTableData from "../../hooks/useTableData";
import { Button } from "@mui/material";
import BonusDialog from "../../components/BonusPenality/Bonus";
import { useAuth } from "../../contexts/AuthContext";
import useUserClaims from "../../hooks/useUserClaims";

const SalaryPage = () => {
  // Step 1
  const [tabsData, setTabsData] = useState([]); // Store your data here
  let active = "";
  let salaryTable = [];

  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData.active !== undefined ? userData.active : "";
    salaryTable =
      userData.salaryTable !== undefined ? userData.salaryTable : [];
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
      field: "totalCredit",
      headerName: "Total Credit",
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
      field: "totalCredit",
      headerName: "Total Credit",
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

  const handleAddBonus = (id) => {
    console.log(id);
  };
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
      >
        {salaryTable.map((tabData) => (
          <Tab key={tabData.id} label={tabData.name} value={tabData.id} />
        ))}
      </Tabs>
      {salary.length > 0 && <DataTable rows={salary} columns={salaryColumn} />}
      <Header title="Staff Salary Table" subtitle="" />
      <Tabs
        value={selectedTab2}
        onChange={handleTabChange2}
        variant="scrollable"
        scrollButtons="auto"
      >
        {salaryTable.map((tabData) => (
          <Tab key={tabData.id} label={tabData.name} value={tabData.id} />
        ))}
      </Tabs>

      {staffSalary.length > 0 && (
        <DataTable
          rows={staffSalary}
          columns={
            userClaims.admin ? staffSalaryColumn : staffSalaryColumnForNonAdmin
          }
        />
      )}
    </Box>
  );
};

export default SalaryPage;
