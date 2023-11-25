import React from "react";
import { Box, useTheme } from "@mui/material";
import WifiTable from "../../../components/Wifi/Tables/branchTable";
import { Helmet } from "react-helmet-async";
const BranchWifi = () => {
  const theme = useTheme();
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Wifi</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta name="description" content="List of wifi orders" />
      </Helmet>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        <WifiTable />
      </Box>
    </>
  );
};

export default BranchWifi;
