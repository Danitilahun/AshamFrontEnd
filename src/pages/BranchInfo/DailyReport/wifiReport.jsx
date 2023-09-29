import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Paper, useTheme } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import WifiDistributeTable from "../../../components/Report/tables/wifiDistribute";

const WifiDistribute = () => {
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
      {/* <Header title="Wifi Report" subtitle="Entire list of wifi Reports" /> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WifiDistributeTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WifiDistribute;
