import React from "react";
import { Box } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import WaterTable from "../../../components/Water/Tables/branchTable";

const BranchWater = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Water Orders"
        subtitle="Entire list of Water Orders"
        from="branch"
      />
      <WaterTable />
    </Box>
  );
};

export default BranchWater;
