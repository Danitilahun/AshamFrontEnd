import React, { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import ReportTable from "../../../components/Report/ReportTable";
import Calculator from "../../../components/VersatileComponents/MoneyNoteCalculator";
import WaterDistributeTable from "../../../components/Report/tables/waterDIstribute";

const WaterDistribute = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Water Report" subtitle="Entire list of water Reports" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WaterDistributeTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default WaterDistribute;
