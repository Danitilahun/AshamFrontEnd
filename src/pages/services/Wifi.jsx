import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import WifiTable from "../../components/Wifi/Tables/callcenterTable";

const Wifi = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        {/* <Header
          title="Wifi Order"
          subtitle="Entire list of Wifi Orders"
          from={"callcenter"}
        /> */}
        <WifiTable />
      </Box>
    </>
  );
};

export default Wifi;
