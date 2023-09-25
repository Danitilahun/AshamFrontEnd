import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import Customer from "../../pages/Money/Credit/customer";
import Staff from "../../pages/Money/Credit/staff";
import Daily from "../../pages/Money/Credit/daily";

const MyTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box m="1rem 0">
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
      {selectedTab === 0 && <Customer />}
      {selectedTab === 1 && <Staff />}
      {selectedTab === 2 && <Daily />}
    </Box>
  );
};

export default MyTabs;
