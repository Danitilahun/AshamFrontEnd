import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import WaterTable from "../../components/Water/Tables/callcenterTable";

const Water = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Water Order"
        subtitle="Entire list of Water Orders"
        from={"callcenter"}
      />
      <WaterTable />
    </Box>
  );
};

export default Water;
