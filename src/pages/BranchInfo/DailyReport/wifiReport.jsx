import React, { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import ReportTable from "../../../components/Report/ReportTable";
import Calculator from "../../../components/VersatileComponents/MoneyNoteCalculator";
import WifiDistributeTable from "../../../components/Report/tables/wifiDistribute";

const WifiDistribute = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Wifi Report" subtitle="Entire list of wifi Reports" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WifiDistributeTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WifiDistribute;
