import React from "react";
import { Box, Grid } from "@mui/material";
import FinanceTable from "../../components/Credit/table/financeCredit";
import Header from "../../components/VersatileComponents/Header";

const FinanceCredit = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Credit" subtitle="Entire list of Credits" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FinanceTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinanceCredit;
