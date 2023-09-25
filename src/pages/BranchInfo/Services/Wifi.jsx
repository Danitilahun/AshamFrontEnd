import React from "react";
import { Box } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import WifiTable from "../../../components/Wifi/Tables/branchTable";

const BranchWifi = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Wifi Orders"
        subtitle="Entire list of Wifi Orders"
        from="branch"
      />
      <WifiTable />
    </Box>
  );
};

export default BranchWifi;
