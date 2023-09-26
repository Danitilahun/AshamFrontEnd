import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, useTheme } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import HotelProfitTable from "../../../components/Report/tables/hospitalProfit";

const HotelProfit = () => {
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
        title="Hotel profit Report"
        subtitle="Entire list of Hotel profit report"
      /> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <HotelProfitTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HotelProfit;
