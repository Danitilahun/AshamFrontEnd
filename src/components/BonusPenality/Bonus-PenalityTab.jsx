import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import BonusPenalityTable from "./tables/tables";

const BonusPentalityTabs = () => {
  // const deliveryGuyId = localStorage.getItem("deliveryGuyId");

  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box m="1rem 0">
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="secondary"
      >
        <Tab label="Bonus" />
        <Tab label="Penality" />
      </Tabs>
      {/* <div>{selectedTab === 0}</div> */}
      {selectedTab === 0 && <BonusPenalityTable type={"Bonus"} />}
      {selectedTab === 1 && <BonusPenalityTable type={"Penality"} />}
    </Box>
  );
};

export default BonusPentalityTabs;
