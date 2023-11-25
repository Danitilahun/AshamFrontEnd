import React, { useState } from "react";
import { Tabs, Tab, Box, Grid } from "@mui/material";
import Customer from "../../pages/Money/Credit/customer";
import Staff from "../../pages/Money/Credit/staff";
import Daily from "../../pages/Money/Credit/daily";
import useDocumentById from "../../hooks/useDocumentById";
import ShowBudget from "../Budget/ShowBudget";

const MyTabs = () => {
  const tabData = {
    2: {
      variableName: "DailyCredit",
      variableValue: "Total Daily Credit",
    },
    1: {
      variableName: "StaffCredit",
      variableValue: "Total Staff Credit",
    },
    0: {
      variableName: "CustomerCredit",
      variableValue: "Total Customer Credit",
    },
  };

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const storedData = localStorage.getItem("userData");

  let branchId = "";
  if (storedData) {
    const userData = JSON.parse(storedData);
    branchId = userData ? userData.id : "try";
  }

  const { documentData: totalCredit } = useDocumentById(
    "totalCredit",
    branchId
  );

  const selectedTabData = tabData[selectedTab];

  return (
    <Box m="1rem 0">
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            // variant="fullWidth"
            indicatorColor="secondary"
            textColor="secondary"
          >
            <Tab label="Customer" />
            <Tab label="Staff" />
            <Tab label="Daily Credit" />
          </Tabs>
        </Grid>
        <Grid item xs={6}>
          {totalCredit ? (
            <ShowBudget
              label={selectedTabData?.variableValue}
              value={totalCredit[selectedTabData?.variableName]?.toFixed(2)}
              marginTop={10}
            />
          ) : null}
        </Grid>
      </Grid>

      {selectedTab === 0 && <Customer />}
      {selectedTab === 1 && <Staff StaffCredit={totalCredit.StaffCredit} />}
      {selectedTab === 2 && <Daily />}
    </Box>
  );
};

export default MyTabs;
