import React, { useEffect, useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import CreditTable from "../../../components/Credit/CreditTable";
import Header from "../../../components/VersatileComponents/Header";
import Calculator from "../../../components/VersatileComponents/MoneyNoteCalculator";
import DailyCreditTable from "../../../components/Credit/table/dailyCredit";

const Daily = ({ initialData }) => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Daily credit" subtitle="Entire list of Customer credits" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DailyCreditTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Daily;
