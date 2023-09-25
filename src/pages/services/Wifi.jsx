import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import WifiTable from "../../components/Wifi/Tables/callcenterTable";

const Wifi = () => {
  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Header
          title="Wifi Order"
          subtitle="Entire list of Wifi Orders"
          from={"callcenter"}
        />
        <WifiTable />
      </Box>
    </>
  );
};

export default Wifi;
