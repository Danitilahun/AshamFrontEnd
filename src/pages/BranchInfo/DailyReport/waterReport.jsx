import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, useTheme } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import WaterDistributeTable from "../../../components/Report/tables/waterDIstribute";

const WaterDistribute = () => {
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
      {/* <Header title="Water Report" subtitle="Entire list of water Reports" /> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WaterDistributeTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WaterDistribute;
