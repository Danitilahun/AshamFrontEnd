import React, { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import Header from "../../../../components/VersatileComponents/Header";
import Calculator from "../../../../components/VersatileComponents/MoneyNoteCalculator";
import ReportTable from "../../../../components/Report/ReportTable";
import CardFeeTable from "../../../../components/Report/tables/cardFee";

const CardFee = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Card Fee Report"
        subtitle="Entire list of Card Fee Reports"
      />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <CardFeeTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardFee;
