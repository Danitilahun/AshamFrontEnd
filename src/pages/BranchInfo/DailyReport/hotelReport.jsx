import React, { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import ReportTable from "../../../components/Report/ReportTable";
import Calculator from "../../../components/VersatileComponents/MoneyNoteCalculator";
import HotelProfitTable from "../../../components/Report/tables/hospitalProfit";

const HotelProfit = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Hotel profit Report"
        subtitle="Entire list of Hotel profit report"
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <HotelProfitTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HotelProfit;
