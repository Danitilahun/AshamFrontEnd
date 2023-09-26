import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import WaterTable from "../../../components/Water/Tables/branchTable";

const BranchWater = () => {
  const theme = useTheme();
  return (
    <Box
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      {/* <Header
        title="Water Orders"
        subtitle="Entire list of Water Orders"
        from="branch"
      /> */}
      <WaterTable />
    </Box>
  );
};

export default BranchWater;
